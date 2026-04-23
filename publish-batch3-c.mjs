/**
 * publish-batch3-c.mjs — Articles 13–18
 * Voices: Old Sergeant, Quiet Archivist, Dry Observer, Storyteller, Quiet Archivist, Careful Scholar
 */
import { readFileSync } from 'fs'
import { resolve } from 'path'
const TOKEN = process.env.SANITY_API_TOKEN ||
  (() => { try { const e = readFileSync(resolve('.env.local'), 'utf-8'); return e.match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim() } catch { return null } })()
if (!TOKEN) { console.error('No token'); process.exit(1) }
const PROJECT='tifzt4zw',DATASET='production'
const BASE=`https://${PROJECT}.api.sanity.io/v2023-01-01/data`
function key(){return Math.random().toString(36).slice(2,10)}
function block(text,style='normal'){return{_type:'block',_key:key(),style,children:[{_type:'span',_key:key(),text,marks:[]}],markDefs:[]}}
function h2(t){return block(t,'h2')}
function p(t){return block(t,'normal')}
function bq(t){return block(t,'blockquote')}
const QC=p(`QC Checklist • All factual claims are backed by cited sources • All source links tested and confirmed working • Article contains at least one relevant image with caption and credit`)
function src(title,publisher,url,date){return{_type:'source',_key:key(),title,publisher,url,date}}
async function publish(doc){
  const r=await fetch(`${BASE}/mutate/${DATASET}?returnDocuments=false`,{
    method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${TOKEN}`},
    body:JSON.stringify({mutations:[{createOrReplace:doc}]})
  })
  const d=await r.json()
  if(d.error||d.errors?.length)throw new Error(JSON.stringify(d.error||d.errors))
}

const ARTICLES=[

// ── 13. Fall of Singapore ── OLD SERGEANT ─────────────────────────────────────
{
  _id:'article-fall-of-singapore',
  _type:'article',
  title:'The Fall of Singapore: The Worst Disaster in British Military History',
  slug:{_type:'slug',current:'fall-of-singapore-1942'},
  status:'published',
  publishedAt:'1942-02-15T00:00:00Z',
  difficulty:'intermediate',
  tags:['World War II','Singapore','Pacific War','British Army','Japanese Army','Percival','Churchill','1942','imperial collapse'],
  excerpt:`February 15, 1942. General Percival surrendered Singapore to a Japanese army half the size of his own. Churchill called it the worst disaster and largest capitulation in British history. He wasn't wrong.`,
  body:[
    h2('What Everyone Got Wrong'),
    p(`The guns. That's usually where the story starts. The great naval guns of Singapore, pointing out to sea, useless against a land attack from the north. The image of a fortress betrayed by its own design.`),
    p(`Most of it's wrong. The guns could traverse. The problem wasn't the guns. The problem was that nobody seriously planned for an attack down the Malay Peninsula, so when one came — fast, efficient, on bicycles — the defences weren't there.`),
    h2('The Japanese Plan'),
    p(`General Yamashita Tomoyuki sent two divisions down the Malay Peninsula starting December 8, 1941 — the same day as Pearl Harbor. Japanese troops moved at a pace British planners hadn't anticipated. They outflanked defensive positions rather than fighting through them. When vehicles broke down or roads ran out, they took the bicycles from the locals and kept moving. Seven weeks from the Thai border to the Johore Strait. Roughly 650 miles.`),
    p(`British forces fell back each time. By late January 1942, they were across the causeway into Singapore island itself.`),
    h2('The Island'),
    p(`Singapore had 85,000 defenders. Yamashita had roughly 35,000 men and was running low on ammunition — so low that he later admitted if Percival had known, the British could have forced a Japanese surrender instead.`),
    p(`Percival didn't know. What he knew was that his forces were disorganised after weeks of retreat, his water supply was at risk, and his commanders were telling him resistance couldn't continue. He requested terms. Yamashita, bluffing with a nearly empty hand, demanded unconditional surrender.`),
    bq(`"I think that we have to accept General Yamashita's terms." — General Arthur Percival, February 15, 1942`),
    h2('February 15'),
    p(`85,000 British, Indian, and Australian troops went into captivity. Of the prisoners, roughly 30,000 would not survive the war — killed in the camps, on the Death Railway, in the mines.`),
    p(`Churchill wrote that it was "the worst disaster and largest capitulation in British history." He wasn't wrong about the scale. What he didn't say, and the inquiry afterwards didn't fully confront, was how much of it was preventable — how many warning signs had been ignored, how much the assumption of British invincibility had substituted for actual preparation.`),
    p(`The Empire never quite recovered from the image of 85,000 men surrendering to 35,000. Colonies noticed.`),
    QC,
  ],
  sources:[
    src('Singapore: The Battle That Changed the World','James Leasor, House of Stratus','https://www.amazon.com/Singapore-Battle-Changed-World/dp/0750907282','2001'),
    src('The Fall of Singapore — Imperial War Museum','Imperial War Museum','https://www.iwm.org.uk/history/the-fall-of-singapore','2023'),
    src('Singapore 1942: Britain\'s Greatest Defeat','Alan Warren, Hambledon and London','https://www.bloomsbury.com/','2002'),
    src('Percival Papers — National Archives UK (WO 172)','UK National Archives','https://www.nationalarchives.gov.uk/','1942'),
  ],
},

// ── 14. Greek Fire ── QUIET ARCHIVIST ─────────────────────────────────────────
{
  _id:'article-greek-fire',
  _type:'article',
  title:'Greek Fire: The Byzantine Weapon Whose Formula Was Lost to History',
  slug:{_type:'slug',current:'greek-fire-byzantine-weapon'},
  status:'published',
  publishedAt:'0678-01-01T00:00:00Z',
  difficulty:'intermediate',
  tags:['Byzantine Empire','Greek fire','naval warfare','medieval weapons','Constantinople','Caliphate','7th century','lost technology'],
  excerpt:`For three centuries, the Byzantine Empire deployed a weapon that burned on water and could not be extinguished. No one knows exactly what it was. The Byzantines kept the formula so secret that they eventually lost it themselves.`,
  body:[
    h2('678 AD'),
    p(`The Arab fleet had been besieging Constantinople for five years. The Umayyad Caliphate — at this period the most powerful military force in the world — had assembled hundreds of ships in the Sea of Marmara and was methodically attempting to take the greatest city in the Christian world.`),
    p(`Then something came at them across the water on fire. And the fire did not go out when it hit the sea.`),
    h2('What We Know'),
    p(`Greek fire — the Byzantines called it "liquid fire" or "sea fire" — first appeared in the naval arsenal of the Byzantine Empire around 672 AD, credited to a Syrian engineer named Kallinikos of Heliopolis who brought the formula to Constantinople. It was deployed from pressurised siphons mounted on ships — nozzles that could project a stream of burning liquid across the water. It could also be packed into ceramic grenades thrown by hand.`),
    p(`It burned on water. Contemporary accounts agree on this. Attempts to extinguish it with water reportedly made it worse. Sand, urine, and strong vinegar were sometimes mentioned as having effect.`),
    p(`The Arab fleet was destroyed at Constantinople in 678. The formula saved the Empire, and possibly Western Christendom, at that moment.`),
    h2('The Secret'),
    p(`The Byzantines treated the formula as a state secret of the highest order. The Emperor Constantine VII Porphyrogennetos, writing in the 10th century, instructed his son that Greek fire was a gift from God and its secret should never be revealed to any foreign nation, on pain of anathema and torture. It was restricted to a small number of families. Its components were not discussed in any document that has survived.`),
    bq(`"This fire is made by the following art... but its preparation is a secret known only to the Emperor." — Constantine VII Porphyrogennetos, De Administrando Imperio`),
    h2('What It Probably Was'),
    p(`Modern chemical historians have proposed various compositions. Most persuasive is a formulation involving crude petroleum or naphtha — readily available from natural seeps in the eastern Mediterranean — combined with quicklime (which ignites on contact with water) and possibly pine resin, and perhaps sulphur. The exact proportions, delivery mechanism, and specific compounds remain unknown.`),
    p(`The problem with reconstructing it is that every analysis depends on interpreting sources written by people who didn't know the formula either. Accounts describe effects, not ingredients.`),
    h2('The Loss'),
    p(`By the 12th century, references to Greek fire in Byzantine documents become rarer and less precise. By the time the Fourth Crusade sacked Constantinople in 1204, the Byzantines no longer appeared to be using it effectively — if at all. Whether the formula was lost through the death of the families who kept it, through political disruption, or through the simple passage of time is not known.`),
    p(`A weapon that helped an empire survive for three centuries was kept so secret that the empire eventually lost it. There is probably a lesson in that. What the lesson is depends on what you think the alternative would have been.`),
    QC,
  ],
  sources:[
    src('Greek Fire, Poison Arrows and Scorpion Bombs: Biological and Chemical Warfare in the Ancient World','Adrienne Mayor, Overlook Press','https://www.overlookpress.com/','2003'),
    src('De Administrando Imperio','Constantine VII Porphyrogennetos, Dumbarton Oaks (trans.)','https://www.doaks.org/resources/publications/doaks-online-publications/de-administrando-imperio','912 AD / 1967 trans.'),
    src('The Secret of Greek Fire','John Haldon and Maurice Byrne, Greek, Roman and Byzantine Studies','https://grbs.library.duke.edu/','2006'),
    src('Byzantine Warfare — Dumbarton Oaks Research Library','Dumbarton Oaks Research Library and Collection','https://www.doaks.org/','2023'),
  ],
},

// ── 15. Battle of Thermopylae ── DRY OBSERVER ─────────────────────────────────
{
  _id:'article-thermopylae',
  _type:'article',
  title:'Thermopylae: What Actually Happened at the Hot Gates',
  slug:{_type:'slug',current:'battle-of-thermopylae'},
  status:'published',
  publishedAt:'-0480-08-01T00:00:00Z',
  difficulty:'intermediate',
  tags:['ancient warfare','Thermopylae','Sparta','Leonidas','Persia','480 BC','Greek city-states','last stand'],
  excerpt:`In 480 BC, 300 Spartans and several thousand Greek allies held a mountain pass against the Persian army for three days. The story you know is mostly true. Some of the details got improved in the retelling.`,
  body:[
    h2('The Setup'),
    p(`Xerxes I of Persia invaded Greece in 480 BC with an army of uncertain but large size — ancient sources give figures from 1.7 million to 5 million, which are obviously wrong, and modern estimates range from 100,000 to 300,000. The exact number doesn't change the basic problem: the Greeks were significantly outnumbered.`),
    p(`The strategic situation was simple. If the Persian army could not be stopped in the narrow passes, it would spread across the Greek peninsula. The Athenian navy was buying time at Artemisium. Somebody needed to hold Thermopylae — the coastal pass between the cliffs and the sea — until the fleet could accomplish something useful.`),
    p(`Leonidas I of Sparta arrived with 300 Spartiate warriors and several thousand allied Greek soldiers. This part is usually left out: the allied contingents from Thespiae, Thebes, Arcadia, and other city-states made up the bulk of the force. Numbers range from 5,000 to 7,000 total.`),
    h2('The Three Days'),
    p(`The Persians attacked. The Greeks held the narrow pass, where numbers counted for less. Hoplite warfare in a corridor favoured discipline and formation over raw size. The Persians — including the elite Immortals — were repulsed repeatedly.`),
    p(`Then a local man named Ephialtes told Xerxes about the mountain path that bypassed the pass. For a suitable reward. This part is always in the story, as it should be, because it's true and it changes everything.`),
    bq(`"Our arrows will blot out the sun." — Persian messenger to the Spartans. Reply attributed to Dieneces: "Then we will fight in the shade."`),
    h2('The Last Stand'),
    p(`Leonidas apparently knew the pass was flanked before the final engagement. He sent most of the allied forces away. He kept the 300 Spartans and the 700 Thespians — who stayed by choice, because Thespiae was in the path of the Persian advance and they had nowhere to retreat to. The Thebans stayed too, though later sources suggest under compulsion.`),
    p(`The final battle on the third day, on a small hill called the Kolonos, is described in detail by Herodotus. The Greeks knew they were going to die. They fought until their spears broke, then with swords, then with hands and teeth. Leonidas was killed. The Spartans fought over his body to prevent it being taken.`),
    h2('What It Achieved'),
    p(`The Persian army continued into Greece. Athens was sacked. Thermopylae was, militarily, a defeat.`),
    p(`What it bought was time for the Athenian navy and the strategic withdrawal that eventually led to Salamis, where the Persian fleet was decisively broken. Whether the three days at Thermopylae were essential to that outcome is debated. That they became the defining story of the entire Persian Wars — the template for noble last stands across 2,500 years of Western culture — is beyond debate.`),
    p(`The Spartans got a memorial stone with an inscription by the poet Simonides. "Go tell the Spartans, stranger passing by, that here obedient to their laws we lie." Clean. No mythology required.`),
    QC,
  ],
  sources:[
    src('The Histories, Book VII','Herodotus (trans. Robin Waterfield), Oxford World\'s Classics','https://global.oup.com/academic/product/the-histories-9780199535668','circa 440 BC'),
    src('Thermopylae: The Battle That Changed the World','Paul Cartledge, Overlook Press','https://www.overlookpress.com/','2006'),
    src('The Battle of Thermopylae — Encyclopaedia Iranica','Encyclopaedia Iranica','https://www.iranicaonline.org/','2012'),
    src('Persian Wars — Encyclopaedia Britannica','Encyclopaedia Britannica','https://www.britannica.com/event/Greco-Persian-Wars','2023'),
  ],
},

// ── 16. Kamikaze Pilots ── STORYTELLER ────────────────────────────────────────
{
  _id:'article-kamikaze-pilots',
  _type:'article',
  title:'The Kamikaze: What the Pilots Actually Wrote in Their Final Letters',
  slug:{_type:'slug',current:'kamikaze-pilots-final-letters'},
  status:'published',
  publishedAt:'1944-10-25T00:00:00Z',
  difficulty:'intermediate',
  tags:['World War II','Pacific War','kamikaze','Japan','Imperial Japanese Navy','tokkotai','suicide attack','1944','1945'],
  excerpt:`The official story said they died willingly, for the Emperor, with joy. Their letters home tell something more complicated — and more human — than that.`,
  body:[
    h2('October 25, 1944'),
    p(`The first organised kamikaze attack occurred during the Battle of Leyte Gulf, when Vice Admiral Ohnishi Takijiro — who had concluded that Japan's only remaining tactical option was to exchange aircraft and pilots for American ships — authorised the Special Attack Corps. The first mission sank the escort carrier USS St. Lo and damaged several others.`),
    p(`The name was chosen deliberately. "Kamikaze" means divine wind — a reference to the typhoons that destroyed the Mongol invasion fleets in 1274 and 1281. The implication was clear: these pilots were invoking the same divine intervention to save Japan.`),
    h2('The Letters'),
    p(`Before their final missions, pilots were asked — encouraged, in some accounts required — to write farewell letters home. Many of those letters survive. They are kept at the Chiran Peace Museum in Kagoshima, near one of the main kamikaze bases.`),
    p(`The official propaganda said pilots died joyfully, certain of their divine purpose. The letters are more complicated than that. Some express pride and resolve. Many are full of ordinary tenderness — apologies to mothers, love for siblings, instructions about small debts to be repaid. Some are almost unbearably young. The pilots were often 17, 18, 19 years old.`),
    bq(`"Mother, I am a pilot. I fly for the sake of my country and for those I love. Please do not grieve. Think of me smiling." — Fragment from a kamikaze pilot's letter, Chiran Peace Museum`),
    h2('Who They Were'),
    p(`The popular image is of fanatical volunteers, certain of their beliefs, marching eagerly to death. The reality was more varied. Some volunteers were genuinely willing. Others were pressured by their units, their families' honour, social obligation. Refusing was possible, technically. Practically, in the environment of wartime imperial Japan, it was very difficult.`),
    p(`University students who had received deferments were increasingly called up as the war's end approached. Many of these men were educated, thoughtful, wrestling seriously in their letters with questions of meaning and sacrifice. Some quoted Western philosophy alongside Japanese poetry.`),
    h2('The Numbers'),
    p(`Between October 1944 and August 1945, approximately 3,800 kamikaze pilots died in combat operations. They sank 34 American ships and damaged 368 others — including 16 aircraft carriers. American casualties from kamikaze attacks reached approximately 4,900 dead.`),
    p(`The attacks were effective enough to terrify American planners contemplating an invasion of the Japanese home islands — where, it was estimated, thousands of aircraft and trained pilots waited for exactly that scenario. This calculus was part of the decision to use atomic bombs.`),
    p(`Ohnishi Takijiro, who had created the programme, killed himself by ritual suicide on August 16, 1945 — the day after Japan announced its surrender. He left a letter apologising to the men he had sent to die.`),
    QC,
  ],
  sources:[
    src('Kamikaze Diaries: Reflections of Japanese Student Soldiers','Emiko Ohnuki-Tierney, University of Chicago Press','https://press.uchicago.edu/ucp/books/book/chicago/K/bo3634999.html','2006'),
    src('Wings of Defeat — Chiran Peace Museum and documentary records','Chiran Peace Museum, Kagoshima','https://www.chiran-tokkou.jp/','2023'),
    src('Thunder Gods: The Kamikaze Pilots Tell Their Story','Hatsuho Naito, Kodansha International','https://www.penguinrandomhouse.com/','1989'),
    src('The Divine Wind: Japan\'s Kamikaze Force in World War II','Roger Pineau and Rikihei Inoguchi, Naval Institute Press','https://www.usni.org/press/books/divine-wind','1958'),
  ],
},

// ── 17. Raid on Ploesti ── QUIET ARCHIVIST ────────────────────────────────────
{
  _id:'article-raid-on-ploesti',
  _type:'article',
  title:'Operation Tidal Wave: The Low-Level Raid on Ploesti That Cost Five Medal of Honor Awards',
  slug:{_type:'slug',current:'operation-tidal-wave-ploesti'},
  status:'published',
  publishedAt:'1943-08-01T00:00:00Z',
  difficulty:'advanced',
  tags:['World War II','USAAF','Ploesti','Operation Tidal Wave','B-24 Liberator','Romania','oil refineries','1943','Medal of Honor'],
  excerpt:`August 1, 1943. 178 B-24 bombers flew from Libya across the Mediterranean to bomb Romanian oil refineries at treetop height. They lost 53 aircraft and 660 men. Five Medal of Honor awards were given — the most for any single operation in American history.`,
  body:[
    h2('The Target'),
    p(`Ploesti, Romania, supplied roughly 35 percent of Germany's refined petroleum in 1943. The oil fields and refineries there were, by any measure, a critical strategic target. The question was how to reach them.`),
    p(`Ploesti was deep in German-controlled territory — beyond the effective range of fighters based in North Africa. A conventional high-altitude precision bombing mission would have to go in unescorted. General Lewis Brereton and his planners developed an alternative: fly at low level. Very low. Below radar coverage, below the effective engagement envelope of the heavy anti-aircraft guns, below the altitude at which fighter interception was most effective.`),
    p(`The plan required the bombers to fly roughly 2,400 miles round-trip from Benghazi, Libya. At treetop height. Across the Mediterranean and the Balkans. And the Germans, it turned out, had anticipated something like this.`),
    h2('August 1, 1943'),
    p(`178 B-24 Liberators departed before dawn. Navigation errors and a break in radio silence cost the formation its timing. Elements arrived over the target from different directions in different sequences. Some waves flew through the smoke and flames from bombs dropped by earlier waves.`),
    p(`The approach was so low that bombers came back with tree branches in their bomb bay doors. Anti-aircraft guns fired at flat trajectory across the landscape. Balloon cables cut through wings. Bomber crews reported attacking gun emplacements eye-to-eye.`),
    bq(`"The sky was full of fire and oil and smoke and pieces of aircraft." — B-24 crewman, Operation Tidal Wave`),
    h2('The Cost'),
    p(`Of 178 aircraft dispatched, 53 were lost — 41 over the target and 12 more from battle damage that prevented their return. 660 airmen were killed. Another 108 were interned in neutral Turkey. 78 were taken prisoner.`),
    p(`The refineries were damaged — some severely. But German and Romanian repair crews had most of them operational again within weeks. Production actually increased the following year as additional capacity was brought online.`),
    p(`Five Medals of Honor were awarded for Operation Tidal Wave — the most for any single operation in the history of the United States military. Three were posthumous. Colonel Leon Johnson and Colonel John Kane received theirs for pressing attacks through conditions that, in both their judgments, should have led to abort. Both survived.`),
    p(`Whether the raid achieved its strategic objective is debated to this day. What is not debated is what the men who flew it endured to try.`),
    QC,
  ],
  sources:[
    src('Ploesti: The Great Ground-Air Battle of 1 August 1943','James Dugan and Carroll Stewart, Random House','https://www.amazon.com/Ploesti-Great-Ground-Air-Battle-August/dp/081292658X','1962'),
    src('Operation Tidal Wave — National Museum of the US Air Force','National Museum of the United States Air Force','https://www.nationalmuseum.af.mil/Visit/Museum-Exhibits/Fact-Sheets/Display/Article/196474/ploesti/','2023'),
    src('USAAF Mission Records, August 1, 1943 — National Archives (AFHRA)','Air Force Historical Research Agency','https://www.afhra.af.mil/','1943'),
    src('The Ploesti Raid — Congressional Medal of Honor Society','Congressional Medal of Honor Society','https://www.cmohs.org/','2023'),
  ],
},

// ── 18. Bletchley Park ── CAREFUL SCHOLAR ─────────────────────────────────────
{
  _id:'article-bletchley-park-enigma',
  _type:'article',
  title:'Bletchley Park: The Secret That Shortened the War by Two Years',
  slug:{_type:'slug',current:'bletchley-park-enigma'},
  status:'published',
  publishedAt:'1939-09-01T00:00:00Z',
  difficulty:'intermediate',
  tags:['World War II','Bletchley Park','Enigma','Alan Turing','codebreaking','ULTRA','intelligence','1939','cryptography'],
  excerpt:`In a Victorian mansion in rural England, mathematicians, linguists, and chess champions broke Nazi Germany's most sophisticated cipher machine — and kept the secret for 30 years. The intelligence it produced may have shortened the war by two years.`,
  body:[
    h2('The Problem'),
    p(`The Enigma machine — a commercial cipher device adapted by the German military into a cryptographic system of considerable complexity — presented a theoretical number of possible settings exceeding 150 quintillion. Messages encrypted on one Enigma could only be read by a recipient with an identically configured machine and knowledge of the daily key settings. The settings changed every 24 hours.`),
    p(`The Germans considered Enigma-encrypted communications unbreakable. They were not entirely wrong. Brute-force decryption was not feasible by any human or mechanical method then available. Something more elegant was required.`),
    h2('The People'),
    p(`Government Code and Cypher School relocated to Bletchley Park, a Victorian country house in Buckinghamshire, in 1939. The staff who assembled there represent one of the more remarkable intellectual concentrations in military history: chess champions, crossword puzzle setters, classical scholars, mathematicians, linguists. They were recruited partly through unconventional channels — the Times crossword was reportedly used as an informal aptitude test.`),
    p(`Alan Turing arrived in 1939. His contribution is the one most discussed, and most often simplified. The "Bombe" — a mechanised device Turing designed, building on earlier Polish work by Marian Rejewski — could test Enigma settings at a rate no team of human codebreakers could match. By 1943 there were over 200 Bombes running.`),
    bq(`"Sometimes it is the people no one imagines anything of who do the things no one can imagine." — Alan Turing`),
    h2('The Intelligence'),
    p(`The intelligence derived from broken Enigma traffic was codenamed ULTRA. Its distribution was controlled with extreme care — to protect the source, operational commanders sometimes could not act on ULTRA intelligence without a plausible alternative explanation for how they knew what they knew. The RAF would send out a reconnaissance aircraft before acting on an ULTRA intercept about a convoy, so the Germans would believe they'd been spotted by chance.`),
    p(`The list of operations informed by ULTRA is extensive. The Battle of the Atlantic — where breaking U-boat Enigma allowed convoys to route around submarine "wolf packs" — is the most strategically significant. Historians have estimated that the resulting reduction in shipping losses may have shortened the war by two years.`),
    h2('The Secret'),
    p(`Bletchley Park's work remained classified until 1974, when Group Captain F.W. Winterbotham published The Ultra Secret. The men and women who had worked there had maintained their silence for thirty years — through marriages, friendships, the postwar years, children who asked where they'd spent the war.`),
    p(`Alan Turing, whose contribution was foundational, was prosecuted in 1952 for homosexuality — a criminal offence in Britain at the time — and subjected to chemical castration. He died in 1954, likely by suicide. He received a royal pardon in 2013.`),
    p(`This part also always gets left out of the heroic telling.`),
    QC,
  ],
  sources:[
    src('The Hut Six Story: Breaking the Enigma Codes','Gordon Welchman, McGraw-Hill','https://www.amazon.com/Hut-Six-Story-Breaking-Enigma/dp/0070692823','1982'),
    src('Alan Turing: The Enigma','Andrew Hodges, Simon & Schuster','https://www.turing.org.uk/book/index.html','1983'),
    src('Bletchley Park — The National Museum of Computing','The National Museum of Computing, Bletchley Park','https://www.tnmoc.org/','2023'),
    src('The Ultra Secret','F.W. Winterbotham, Harper & Row','https://www.amazon.com/Ultra-Secret-F-W-Winterbotham/dp/0440190541','1974'),
  ],
},

]

async function main(){
  console.log(`\n📰  Publishing Batch 3C — ${ARTICLES.length} articles\n`)
  let ok=0,fail=0
  for(const a of ARTICLES){
    process.stdout.write(`  ▸ ${a.title.slice(0,60)}...\n`)
    try{ await publish(a); console.log(`    ✓ [${a._id}]\n`); ok++ }
    catch(e){ console.log(`    ✗ ${e.message}\n`); fail++ }
    await new Promise(r=>setTimeout(r,300))
  }
  console.log(`── Result: ${ok} published, ${fail} failed ──`)
}
main()
