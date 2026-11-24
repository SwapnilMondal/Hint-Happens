import {createClient} from "https://esm.sh/@supabase/supabase-js@2";
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS"};
const json=(d,s=200)=>new Response(JSON.stringify(d),{status:s,headers:{...cors,"Content-Type":"application/json"}});
const norm=s=>String(s||"").normalize("NFKC").toLowerCase().replace(/[\u200B-\u200D\uFEFF]/g,"").replace(/[^a-z0-9]+/g," ").trim();
const name=s=>String(s||"Player").replace(/[<>]/g,"").replace(/\s+/g," ").trim().slice(0,18)||"Player";
Deno.serve(async req=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});if(req.method!=="POST")return json({ok:false},405);
 try{
 const url=Deno.env.get("SUPABASE_URL"),service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),anon=Deno.env.get("SUPABASE_ANON_KEY");if(!url||!service||!anon)return json({ok:false,message:"Server not configured"},503);
 const admin=createClient(url,service,{auth:{persistSession:false}}),jwt=createClient(url,anon,{global:{headers:{Authorization:req.headers.get("Authorization")||""}},auth:{persistSession:false}});
 const {data:{user},error:authError}=await jwt.auth.getUser();if(authError||!user)return json({ok:false,message:"Authentication required"},401);
 const b=await req.json(),action=b.action,n=name(b.displayName),ip=(req.headers.get("cf-connecting-ip")||req.headers.get("x-forwarded-for")||"").split(",")[0].trim()||null;
 const upsertUser=()=>admin.from("moderation_users").upsert({user_id:user.id,display_name:n,ip_address:ip,last_seen_at:new Date().toISOString(),expires_at:new Date(Date.now()+864000000)},{onConflict:"user_id"});
 if(action==="login"){const {error}=await upsertUser();if(error)throw error;return json({ok:true})}
 if(action==="submit"){
 const room=String(b.roomCode||"").toUpperCase().replace(/[^A-HJ-NP-Z2-9]/g,"").slice(0,10),raw=String(b.message||"").trim().slice(0,240);if(!room||!raw)return json({ok:false,message:"Room/message required"},400);
 const normalized=norm(raw),tokens=normalized.split(" ").filter(Boolean),{data:terms,error}=await admin.from("moderation_terms").select("term,term_type").eq("enabled",true);if(error)throw error;
 const found=(terms||[]).filter(t=>{const term=norm(t.term);return t.term_type==="phrase"?(" "+normalized+" ").includes(" "+term+" "):tokens.includes(term)});
 const flaggedCount=found.reduce((n,t)=>n+(t.term_type==="phrase"?1:tokens.filter(w=>w===norm(t.term)).length),0);
 const ev={user_id:user.id,display_name:n,room_code:room,event_type:found.length?"blocked":"allowed",flagged_terms:[...new Set(found.map(t=>t.term))],flagged_word_count:flaggedCount,message_excerpt:raw.slice(0,80),expires_at:new Date(Date.now()+864000000).toISOString()};
 const {error:uerr}=await upsertUser();if(uerr)throw uerr;const {error:eerr}=await admin.from("moderation_events").insert(ev);if(eerr)throw eerr;
 if(found.length)return json({ok:false,message:"Blocked by chat filter",flaggedTerms:ev.flagged_terms,flaggedWordCount:flaggedCount});
 const id=crypto.randomUUID(),{error:ce}=await admin.from("moderated_chat").insert({id,room_code:room,user_id:user.id,display_name:n,message:raw,expires_at:new Date(Date.now()+864000000).toISOString()});if(ce)throw ce;return json({ok:true,message:{id,sender:n,text:raw,time:Date.now()}});
 }
 if(action==="fetch"){const room=String(b.roomCode||"").toUpperCase().replace(/[^A-HJ-NP-Z2-9]/g,"").slice(0,10),{data,error}=await admin.from("moderated_chat").select("id,display_name,message,created_at").eq("id",String(b.messageId||"").slice(0,64)).eq("room_code",room).maybeSingle();if(error)throw error;if(!data)return json({ok:false},404);return json({ok:true,message:{id:data.id,sender:data.display_name,text:data.message,time:new Date(data.created_at).getTime()}})}
 if(["admin","term-add","term-toggle"].includes(action)){const {data:a,error:ae}=await admin.from("moderation_admins").select("user_id").eq("user_id",user.id).maybeSingle();if(ae)throw ae;if(!a)return json({ok:false,message:"Admin required"},403);
 if(action==="admin"){const [ev,us,ts]=await Promise.all([admin.from("moderation_events").select("id,display_name,room_code,event_type,flagged_terms,flagged_word_count,message_excerpt,created_at").order("created_at",{ascending:false}).limit(250),admin.from("moderation_users").select("user_id,display_name,ip_address,last_seen_at,expires_at").order("last_seen_at",{ascending:false}).limit(250),admin.from("moderation_terms").select("id,term,term_type,enabled").order("term")]);if(ev.error||us.error||ts.error)throw ev.error||us.error||ts.error;return json({ok:true,events:ev.data,users:us.data,terms:ts.data})}
 if(action==="term-add"){const term=String(b.term||"").trim().slice(0,80);if(!term)return json({ok:false,message:"Term required"},400);const {error}=await admin.from("moderation_terms").insert({term,term_type:b.termType==="phrase"?"phrase":"word"});if(error)throw error}
 else {const {error}=await admin.from("moderation_terms").update({enabled:!!b.enabled}).eq("id",b.id);if(error)throw error}
 return json({ok:true})
 }
 return json({ok:false,message:"Unknown action"},400);
 }catch(e){console.error(e);return json({ok:false,message:"Moderation error"},500)}
});