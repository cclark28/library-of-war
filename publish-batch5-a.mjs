import { readFileSync } from 'fs'
import { resolve } from 'path'
const TOKEN = process.env.SANITY_API_TOKEN ||
  (() => { try { const e = readFileSync(resolve('.env.local'), 'utf-8'); return e.match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim() } catch { return null } })()
if (!TOKEN) { console.error('No token'); process.exit(1) }
const PROJECT = 'tifzt4zw', DATASET = 'production'
const BASE = `https://${PROJECT}.api.sanity.io/v2023-01-01/data`

function key() { return Math.random().toString(36).slice(2, 10) }
function block(text, style = 'normal') {
  return { _type: 'block', _key: key(), style, children: [{ _type: 'span', _key: key(), text, marks: [] }], markDefs: [] }
}
function h2(t) { return block(t, 'h2') }
function p(t) { return block(t, 'normal') }
function bq(t) { return block(t, 'blockquote') }
function linked(segments) {
  const markDefs = [], children = []
  for (const seg of segments) {
    if (typeof seg === 'string') {
      children.push({ _type: 'span', _key: key(), text: seg, marks: [] })
    } else {
      const k = key()
      markDefs.push({ _key: k, _type: 'link', href: seg.href })
      children.push({ _type: 'span', _key: key(), text: seg.text, marks: [k] })
    }
  }
  return { _type: 'block', _key: key(), style: 'normal', children, markDefs }
}
function source(label, href) {
  const k = key()
  return { _type: 'block', _key: key(), style: 'normal', markDefs: [{ _key: k, _type: 'link', href }], children: [{ _type: 'span', _key: key(), text: label, marks: [k] }] }
}

async function publish(article) {
  const r = await fetch(`${BASE}/mutate/${DATASET}?returnDocuments=false`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ mutations: [{ createOrReplace: article }] })
  })
  if (!r.ok) throw new Error(await r.text())
}

const ARTICLES = [

  // ── 35. BATTLE OF GAUGAMELA — Dry Observer ─────────────────────────────────
  {
    _id: 'article-battle-of-gaugamela',
    _type: 'article',
    title: "Gaugamela: Alexander's Greatest Trick Was Getting Darius to Play Along",
    slug: { _type: 'slug', current: 'article-battle-of-gaugamela' },
    publishedAt: '2026-04-23T08:00:00Z',
    excerpt: "On October 1, 331 BC, Alexander the Great destroyed the Persian army at Gaugamela. Darius had levelled the ground for his scythed chariots. He'd also built the gap that finished him.",
    body: [
      h2('The Ground Darius Prepared'),
      p("Darius III chose the plain at Gaugamela — near modern Mosul in northern Iraq — for the decisive battle of his empire. He had the ground levelled to give his scythed chariots room to operate. He positioned 200 of them in his front line. He had 15 war elephants. He commanded perhaps 100,000 soldiers, though ancient sources give figures ranging from there to one million, which historians treat with the charity usually reserved for ancient sources."),
      p("Alexander had around 47,000. He looked at the levelled plain, the chariots, the depth of the Persian line, and reportedly said he stole his victories. He was going to steal this one too."),
      h2('The Oblique Advance'),
      linked(["The battle on ", {text: "October 1, 331 BC", href: "https://en.wikipedia.org/wiki/Battle_of_Gaugamela"}, " turned on one tactical choice. Alexander advanced his right wing diagonally rather than straight ahead, marching his Companion Cavalry progressively to the right. The Persian left extended to match him, because if they didn't he would flank them. They did this until a gap opened in the Persian center."]),
      p("Alexander pivoted into the gap. That was it. The most powerful empire in the world ended in an afternoon because its king responded predictably to a predictable invitation."),
      p("Darius had cavalry superiority and numerical advantage and a prepared battlefield and a force of scythed chariots that should have been terrifying. The chariots were neutralized by skirmishers who pulled the horses sideways and opened lanes through the Macedonian line for the chariots to pass harmlessly through. War elephants were never a reliable weapon in pitched battle, then or ever. And Darius's numerical advantage was irrelevant once his center broke, because the men on his flanks were busy fighting and couldn't redirect."),
      h2('The Flight of Darius'),
      p("Darius fled the battlefield. He had done this before, at the Issus in 333 BC, and it had cost him everything except the war itself. He would not get a third chance. His own satraps killed him in July 330 BC, before Alexander could catch him, which deprived Alexander of a dramatic imperial capture but saved considerable time."),
      p("The Persian treasury at Persepolis yielded approximately 120,000 talents of silver — enough to fund decades of military operations. Alexander burned Persepolis afterward. He said it was revenge for the burning of Athens in 480 BC. Whether this was justice, political theatre, or both depends on how generously you interpret the behavior of conquerors."),
      bq('"I would not steal a victory." — Alexander, attributed by Plutarch, declining advice to attack the Persian camp at night before Gaugamela'),
      h2('What It Ended'),
      p("The Achaemenid Persian Empire, which had existed since Cyrus the Great conquered Babylon in 539 BC, ceased to function as a political entity within a year of Gaugamela. Two hundred years of the largest empire the world had yet seen, gone because the king panicked when his center was pierced."),
      linked(["Alexander's subsequent campaigns took him to Central Asia, Afghanistan, and into northwestern India before his generals refused to go further. He died in Babylon in 323 BC, age 32, of causes still debated. His empire fractured immediately on his death. The ", {text: "Diadochi — the Successor kingdoms", href: "https://en.wikipedia.org/wiki/Diadochi"}, " — spent the next forty years fighting over the pieces."]),
      p("Gaugamela itself survived in memory primarily as a demonstration of what oblique advance and concentrated striking power could accomplish against a numerically superior but rigidly structured opponent. Military academies discussed it for the next two thousand years. Some still do."),
      h2('Sources'),
      source('Arrian, Anabasis Alexandri (primary source, c. 2nd century AD) — Project Gutenberg', 'https://www.gutenberg.org/ebooks/46976'),
      source('Wikipedia: Battle of Gaugamela', 'https://en.wikipedia.org/wiki/Battle_of_Gaugamela'),
      source('Britannica: Battle of Gaugamela', 'https://www.britannica.com/event/Battle-of-Gaugamela'),
      source('Plutarch, Life of Alexander (primary source) — MIT Classics', 'http://classics.mit.edu/Plutarch/alexandr.html'),
    ]
  },

  // ── 36. SIEGE OF VIENNA (1683) — Storyteller ──────────────────────────────
  {
    _id: 'article-siege-of-vienna-1683',
    _type: 'article',
    title: 'The Gates of Vienna: The Day the Ottoman Empire Reached Its Limit',
    slug: { _type: 'slug', current: 'article-siege-of-vienna-1683' },
    publishedAt: '2026-04-23T08:01:00Z',
    excerpt: "September 12, 1683. Sixty thousand Ottoman soldiers were outside Vienna's walls. They had been there two months. The relief army, 80,000 strong, descended from the hills at dawn. What followed was the largest cavalry charge in European history.",
    body: [
      h2('Two Months'),
      p("The city had been under siege since July 14. Grand Vizier Kara Mustafa Pasha had refused the fastest method — a direct assault on the walls — preferring the slower certainty of mining operations. His engineers dug galleries under the bastions, packed them with explosives, and waited. The walls crumbled section by section. Inside, the defenders patched the breaches with rubble, timber, whatever came to hand."),
      p("The garrison numbered around 15,000 soldiers. The civilian population — some 60,000 — had been running short of food for weeks. The livestock were gone. The bread ration had been cut and cut again. Disease had entered the city in the way disease always enters besieged cities, which is through the water supply and the accumulation of unburied dead."),
      p("Count Ernst Rüdiger von Starhemberg, commanding the defense, sent courier after courier through the Ottoman lines. They mostly got through. The relief army was coming. The question was whether it would arrive before the mines did."),
      h2('The Kahlenberg'),
      linked(["Jan III Sobieski, King of Poland, descended from the Kahlenberg ridge at dawn on ", {text: "September 12, 1683", href: "https://en.wikipedia.org/wiki/Battle_of_Vienna"}, " at the head of the largest cavalry force assembled in early modern Europe. The relief army numbered around 80,000 men: Polish, German, and Austrian troops united under a Holy League banner, the enterprise blessed by Pope Innocent XI."]),
      p("The Polish Winged Hussars led the final charge. The hussars were heavy cavalry, armored, armed with lances nearly six meters long, distinguished by the curved wooden frames mounted behind their saddles from which eagle and ostrich feathers rose in spectacular display. Their purpose was psychological as much as tactical — the wings supposedly made a sound in the charge, a rushing, rattling noise that preceded them into contact."),
      p("Eighteen thousand cavalry struck the Ottoman camp in the early afternoon. The camp — a canvas city that housed an army, with Kara Mustafa's personal tent at its center — was not prepared for a charge from the rear. The Ottomans had been watching the Kahlenberg ridge. They had not moved their camp or prepared their rear for assault."),
      h2("What Was Left Behind"),
      p("Kara Mustafa fled. His tent remained. Inside were things that had arrived with the Ottoman army from Constantinople and had traveled months across the Balkans: gold, correspondence, military stores, carpets — and coffee. The story goes that Franz Kolschitzky, a Viennese merchant who had lived in the Ottoman world and served as a spy during the siege, claimed the abandoned coffee sacks as his reward and opened Vienna's first coffeehouse. The story is probably embellished. Coffee was in Vienna before 1683. But its association with the siege persists."),
      bq('"I came, I saw, God conquered." — Jan Sobieski, paraphrasing Caesar in a letter to Pope Innocent XI after the battle'),
      h2('The Consequence'),
      p("Kara Mustafa reached Belgrade. On Christmas Day 1683, the Sultan's representatives arrived with a silk bowstring. He was strangled in the traditional manner. The failure at Vienna required an explanation that would not implicate the system; Kara Mustafa provided one."),
      linked(["The Ottoman Empire never again pushed as far west. The ", {text: "Great Turkish War that followed", href: "https://en.wikipedia.org/wiki/Great_Turkish_War"}, " — the Holy League's counter-offensive — resulted in the Treaty of Karlowitz in 1699 and permanent Ottoman withdrawal from Hungary. The 1683 siege marked the high-water mark of Ottoman expansion into Europe."]),
      p("Vienna remained the Habsburg capital. The winged hussars rode back to Poland. The coffeehouse on the Rotenturmstrasse, whatever its origins, became part of the city's self-understanding. Vienna has been producing elaborate pastries and arguing about coffee ever since."),
      h2('Sources'),
      source('Wikipedia: Battle of Vienna (1683)', 'https://en.wikipedia.org/wiki/Battle_of_Vienna'),
      source('Britannica: Battle of Vienna', 'https://www.britannica.com/event/Battle-of-Vienna-1683'),
      source('Wheatcroft, Andrew: The Enemy at the Gate (2009) — comprehensive modern account', 'https://www.harpercollins.com/products/the-enemy-at-the-gate-andrew-wheatcroft'),
      source('Stoye, John: The Siege of Vienna (1964)', 'https://www.edinburghuniversitypress.com/book-the-siege-of-vienna.html'),
    ]
  },

  // ── 37. BATTLE OF BLENHEIM (1704) — Quiet Archivist ───────────────────────
  {
    _id: 'article-battle-of-blenheim',
    _type: 'article',
    title: 'Blenheim: The Battle That Embarrassed France and Built a Palace',
    slug: { _type: 'slug', current: 'article-battle-of-blenheim' },
    publishedAt: '2026-04-23T08:02:00Z',
    excerpt: "On August 13, 1704, Marlborough and Eugene of Savoy captured an entire French army at Blenheim. It was the first time a French force had been taken in the field since the medieval period. The victory came because Marlborough marched his army 400 kilometres to a battlefield no one expected him to be on.",
    body: [
      h2('The Strategic Deception'),
      linked(["The Duke of Marlborough informed the Dutch government in spring 1704 that he intended to reinforce the Rhine frontier. This was not true. He intended to march south to the Danube to relieve pressure on Austria, which was threatened by a Franco-Bavarian army. The Dutch, who had authority over his movements under the Grand Alliance structure, might not have approved a march into southern Germany. Marlborough did not give them the opportunity to object. He was moving before they understood where he was going."]),
      p("The march from the Netherlands to the Danube — roughly 400 kilometres — was conducted with impressive logistical preparation. Marlborough pre-positioned supply depots along the route, arranged for new boots to be distributed at set intervals to prevent blistering, and maintained a pace that kept the army in better physical condition at the end of the march than most armies achieved at the beginning of a campaign."),
      p("When his force arrived in Bavaria in late June, the French and Bavarian commanders faced a threat in a theater they had not expected to defend. Their repositioning options were limited by time."),
      h2('The Tactical Shape'),
      linked(["On ", {text: "August 13, 1704", href: "https://en.wikipedia.org/wiki/Battle_of_Blenheim"}, ", Marlborough and his Austrian co-commander Prince Eugene of Savoy faced a Franco-Bavarian army under Marshal Tallard along the Danube near the village of Blenheim. The Allied force numbered approximately 52,000. The French and Bavarians had around 56,000."]),
      p("Blenheim village anchored the French right flank. Marlborough launched determined attacks against it throughout the morning. These attacks were never seriously expected to succeed — their purpose was to draw French infantry into the village streets, where the density of the position would make it impossible to maneuver or deploy to support the main line."),
      p("They drew approximately 11,000 of France's best foot soldiers into Blenheim and kept them there."),
      p("The French center, weakened by the detachment to Blenheim and a second strong point at Oberglau, was struck by the Allied main body in the early afternoon. The line broke. Marshal Tallard attempted to rally his cavalry and was captured. The French infantry trapped in Blenheim eventually surrendered when they realized the battle was lost and there was no escape."),
      bq('"I have not time to say more, but to beg you will give my duty to the Queen, and let her know her army has had a glorious victory." — Marlborough, writing to his wife Sarah on the back of a tavern bill, the night of Blenheim'),
      h2('The Result'),
      p("Approximately 14,000 French and Bavarian soldiers were taken prisoner, including Tallard. It was the largest capture of a French military force since the medieval period. France had not suffered a defeat of this magnitude in living memory. The shock in Paris was considerable."),
      linked(["The strategic consequence was the preservation of Austria and the prevention of French hegemony over continental Europe — at least for another generation. Queen Anne rewarded Marlborough with the royal manor of Woodstock and funds to build a palace there. ", {text: "Blenheim Palace", href: "https://www.blenheimpalace.com/"}, " took seventeen contentious years to complete. It is the birthplace of Winston Churchill."]),
      p("Winston Churchill wrote a biography of his ancestor Marlborough. It runs to four volumes and is considered an excellent biography of Marlborough that tells us a great deal about Churchill."),
      h2('Sources'),
      source('Wikipedia: Battle of Blenheim', 'https://en.wikipedia.org/wiki/Battle_of_Blenheim'),
      source('Chandler, David: Marlborough as Military Commander (1973)', 'https://www.pen-and-sword.co.uk/Marlborough-as-Military-Commander-Hardback/p/13816'),
      source('National Army Museum: Battle of Blenheim', 'https://www.nam.ac.uk/explore/battle-blenheim'),
      source('Blenheim Palace official site', 'https://www.blenheimpalace.com/'),
    ]
  },

  // ── 38. BATTLE OF BUNKER HILL (1775) — Careful Scholar ────────────────────
  {
    _id: 'article-battle-of-bunker-hill',
    _type: 'article',
    title: 'Bunker Hill: The Battle on the Wrong Hill That Changed the Right Things',
    slug: { _type: 'slug', current: 'article-battle-of-bunker-hill' },
    publishedAt: '2026-04-23T08:03:00Z',
    excerpt: "The Battle of Bunker Hill was fought primarily on Breed's Hill, which is not Bunker Hill. It was a British tactical victory achieved at a 40 percent casualty rate. Both sides drew exactly the wrong conclusion — and both turned out to be right.",
    body: [
      h2('The Wrong Hill'),
      p("The geographical confusion in the battle's name is not a later simplification. Contemporary accounts already used both hill names interchangeably, and the colonial forces themselves had originally intended to fortify Bunker Hill, which was higher and further from Boston. During the night of June 16-17, 1775, Colonel William Prescott's force of approximately 1,200 men decided instead to fortify the lower, nearer Breed's Hill, apparently finding it more tactically useful for threatening the town."),
      p("The decision had consequences. Breed's Hill was closer and more exposed, which made it more threatening to the British fleet and garrison in Boston — and more vulnerable to the assault that followed."),
      p("When British commanders discovered the overnight fortifications at dawn, they faced a strategic problem: colonial forces controlling those heights could place artillery fire on both Boston harbor and the town itself. The works had to be taken. The question was how."),
      h2('The Three Assaults'),
      linked(["General William Howe, commanding the British assault force, elected to attack in formal linear formation rather than waiting for naval gunfire to reduce the works. On ", {text: "June 17, 1775", href: "https://en.wikipedia.org/wiki/Battle_of_Bunker_Hill"}, ", approximately 2,200 British regulars crossed Boston Harbor in boats and formed for assault on the beach below Breed's Hill."]),
      p("The first assault was repulsed. The colonists held fire until the British were close — the famous instruction not to fire until you could see the whites of their eyes is likely apocryphal in its precise phrasing, but the underlying order was real and driven by ammunition scarcity, not drama. The sustained fire at close range was devastating to troops advancing in close formation uphill."),
      p("The second assault was also repulsed. British casualties after two attempts numbered in the hundreds, including a disproportionate loss among officers — about 100 of 200 British officers engaged were killed or wounded."),
      p("The third assault succeeded, but only because American ammunition was exhausted. The defenders fought with reversed muskets and bare hands during the final minutes before withdrawing across Charlestown Neck."),
      bq('"The day is ours, but God knows what it has cost us." — General Henry Clinton, British, on the casualties at Bunker Hill'),
      h2('Dr. Warren'),
      linked(["Dr. Joseph Warren, ", {text: "one of the most prominent patriot leaders", href: "https://www.britannica.com/biography/Joseph-Warren"}, " in Massachusetts — organizer of the Sons of Liberty and key figure in the intelligence network that had warned of British movements before Lexington and Concord — had recently been commissioned a Major General. He arrived at the battle as a volunteer, declining to take command over Prescott. He was killed in the final moments of the retreat, shot in the head. His death was a significant blow to the colonial cause that was not easily replaced."]),
      h2('What Each Side Learned'),
      p("The British concluded they had won — which was correct — and that colonial militia could be swept aside — which was incorrect. The 40 percent casualty rate among attacking forces was not a victory template anyone wished to repeat, but the conclusion drawn was that next time the colonists would simply run."),
      p("The Americans concluded they had effectively held professional troops to a standstill — which was approximately correct — and that their forces were capable of fighting in the open against British regulars. This second conclusion would prove repeatedly wrong over the next several years. Washington would spend much of the war keeping his army intact by avoiding exactly the kind of set-piece engagement that Bunker Hill appeared to recommend."),
      p("Both sides were simultaneously right and wrong in ways that shaped the next eight years of conflict."),
      h2('Sources'),
      source('Wikipedia: Battle of Bunker Hill', 'https://en.wikipedia.org/wiki/Battle_of_Bunker_Hill'),
      source('National Park Service: Battle of Bunker Hill', 'https://www.nps.gov/bost/learn/historyculture/battleofbunkerhill.htm'),
      source('Bunker Hill Monument Association', 'https://www.battleofbunkerhill.org/'),
      source('Philbrick, Nathaniel: Bunker Hill: A City, A Siege, A Revolution (2013)', 'https://www.penguinrandomhouse.com/books/217032/bunker-hill-by-nathaniel-philbrick/'),
    ]
  },

  // ── 39. BATTLE OF LONG TAN (1966) — Old Sergeant ──────────────────────────
  {
    _id: 'article-battle-of-long-tan',
    _type: 'article',
    title: 'Long Tan: 108 Australians, 2,500 Enemy, One Rubber Plantation',
    slug: { _type: 'slug', current: 'article-battle-of-long-tan' },
    publishedAt: '2026-04-23T08:04:00Z',
    excerpt: "August 18, 1966. D Company, 6 RAR, went out on patrol looking for whoever mortared their base the night before. 108 men. They found 2,500. Three hours and twelve minutes later, 18 Australians were dead. The plantation is still there.",
    body: [
      h2('The Patrol'),
      p("The mortars had hit Nui Dat base the night before. Eleven men wounded, some artillery rounds and stores destroyed. Standard enough. D Company went out the next morning to find the firing position and see who'd done it."),
      p("They found 18 craters. They found tracks. And then, in the rows of a rubber plantation about four kilometres from the wire, they found the 275th Main Force Regiment of the People's Army of Vietnam — somewhere between 2,000 and 2,500 soldiers who had been staging for an assault on the base itself."),
      p("D Company had 108 men."),
      h2('Three Hours and Twelve Minutes'),
      linked(["The contact report went back to Nui Dat at 3:40 PM on ", {text: "August 18, 1966", href: "https://www.awm.gov.au/articles/event/longtan"}, ". The artillery battery — 103 Field Battery, Royal Australian Artillery — started shooting. They shot for three hours and twelve minutes, nearly continuous, walking fire around D Company's perimeter as the enemy attacks came from multiple directions in the rain."]),
      p("The rain was the thing. It had been raining all day. The monsoon. The rubber trees dripped. Visibility in the plantation was maybe fifty metres on a good day and this was not a good day. D Company was fighting in short, savage contacts at close range, working on sound and muzzle flash as much as sight."),
      p("What kept them alive was the guns. The artillery fired over 3,000 rounds. The trajectories were close enough that the Australians could hear the shells passing overhead and feel the concussion. They called adjustments by radio, shifting the fire to break up each successive assault."),
      p("RAAF helicopters got ammunition to them at around 5:30 PM, flying in under fire because the men on the ground were nearly out of rounds. Pilots flying at treetop level in the rain to reach men they could barely see."),
      bq('"The men of Delta Company just refused to give in. They were completely surrounded, ammunition was nearly exhausted, and they fought on." — Major Harry Smith, D Company commander'),
      h2('The Relief'),
      linked(["APCs from B Squadron, 3rd Cavalry Regiment came through the plantation in the last light — fifteen armoured personnel carriers carrying B Company as infantry, crashing through the rubber rows, headlights on, scattering the assault. It ended around 7 PM. After dark, it was quiet. ", {text: "Australia's Vietnam war", href: "https://www.awm.gov.au/articles/encyclopaedia/vietnam"}, " would continue for six more years. Long Tan was its bloodiest single engagement."]),
      p("When they counted: 18 Australians dead, 24 wounded. 245 enemy bodies in the plantation. Estimated total enemy casualties, including those carried from the field: between 500 and 800."),
      h2('The Recognition That Took Decades'),
      p("Three Victoria Crosses were awarded. The South Vietnamese government awarded D Company a citation. The Australian government took years to officially recognize Long Tan Day, because publicly honoring the battle drew attention to the war — which was, by 1966, already politically contentious at home."),
      linked(["The rubber plantation is ", {text: "near the town of Ba Ria in Phuoc Tuy Province", href: "https://en.wikipedia.org/wiki/Battle_of_Long_Tan"}, ". The Vietnamese built a memorial on it. For decades, Australian veterans weren't permitted to visit. Access was eventually granted. The trees are still there. The rows are still straight."]),
      h2('Sources'),
      source('Australian War Memorial: Battle of Long Tan', 'https://www.awm.gov.au/articles/event/longtan'),
      source('Wikipedia: Battle of Long Tan', 'https://en.wikipedia.org/wiki/Battle_of_Long_Tan'),
      source('Horner, David: SAS: Phantoms of the Jungle (for broader Vietnam context)', 'https://www.awm.gov.au/collection/C1417459'),
      source('National Archives of Australia: Long Tan records', 'https://www.naa.gov.au/explore-collection/australias-military-history/vietnam-war'),
    ]
  },

  // ── 40. RAID ON ST. NAZAIRE (1942) — Dry Observer ─────────────────────────
  {
    _id: 'article-raid-on-st-nazaire',
    _type: 'article',
    title: "Operation Chariot: The Maddest Plan That Actually Worked",
    slug: { _type: 'slug', current: 'article-raid-on-st-nazaire' },
    publishedAt: '2026-04-23T08:05:00Z',
    excerpt: "On March 28, 1942, the British rammed an obsolete destroyer full of explosives into the largest dry dock in occupied Europe, then set it off while German officers stood on the deck. Five Victoria Crosses. One destroyed dock. Very high casualties. Completely worth it.",
    body: [
      h2('The Problem'),
      p("The Tirpitz was Germany's largest battleship and, in early 1942, was in Norwegian waters threatening Allied convoys. The concern was not what she was doing — she wasn't actually doing much — but what she could do if she moved into the Atlantic. She could do a great deal, since no ship in the Atlantic Fleet could match her."),
      p("The only dry dock on the Atlantic coast capable of servicing the Tirpitz if she were damaged in action was the Normandie Dock at St. Nazaire, France — named for the liner that had been built there. If the dock were destroyed, the Tirpitz would be effectively confined to Norwegian waters, because entering the Atlantic would mean accepting damage with no repair option."),
      p("The solution to the problem of destroying the dock was straightforward: ram the dock gate with an old destroyer full of time-delay explosives. The problem of getting the old destroyer there was somewhat more complex."),
      h2('The Plan'),
      linked(["HMS Campbeltown, an obsolete American destroyer modified for the purpose, would be disguised with German-style funnels and fly a German naval ensign. She would sail 700 kilometres up the French coast, enter the Loire estuary, and crash into the dock gates at St. Nazaire. Commandos would simultaneously land to destroy pump machinery and other dock infrastructure. The delayed charges in Campbeltown's bow would explode the following morning.", " The ", {text: "official codename was Operation Chariot", href: "https://en.wikipedia.org/wiki/St_Nazaire_Raid"}, "."]),
      p("The deception element of the plan — the disguise and the German flag — was expected to provide perhaps a few minutes of confusion before shore batteries identified the approaching vessels. The plan assumed severe casualties and included no provision for a second attempt if the first failed."),
      p("In the words of Admiral Mountbatten, who authorized it: 'The operation was almost too hazardous to contemplate.'"),
      h2('What Happened'),
      p("The disguise lasted until approximately 01:20 AM, when German signal stations challenged the approaching convoy and the British reply was not convincing. Shore batteries opened fire. Campbeltown continued at full speed under direct fire, trailing Coastal Forces motor launches that were taking casualties from every direction."),
      p("She rammed the dock gate at 01:34 AM, approximately 4 minutes late and 9 metres off target. Both numbers are acceptable given the circumstances. The commandos landed. Some reached their objectives. Many were killed or captured within minutes of touching the dock. The remaining motor launches attempted withdrawal under fire that destroyed most of them."),
      linked(["Campbeltown sat in the dock gate through the night and into the following morning. German officers climbed aboard to inspect the damage. A number of soldiers and curious civilians were on her deck at around noon when approximately ", {text: "4 tons of delayed-action explosives detonated", href: "https://www.nationalarchives.gov.uk/help-with-your-research/research-guides/commando-units-second-world-war/"}, "."]),
      bq('"The attack... was one of the most courageous attacks of the war." — Captain Stephen Roskill, Official Naval Historian'),
      h2('The Accounting'),
      p("Of 611 men who participated, 169 were killed and 215 taken prisoner. Five Victoria Crosses were awarded — the most for any single British operation in the Second World War. The Normandie Dock was unusable for the remainder of the war. The Tirpitz never operated in the Atlantic. She was eventually sunk in a Norwegian fjord in November 1944 by RAF Tall Boy bombs."),
      p("By the logic of strategic accounting: one obsolete destroyer traded for one functional battleship, permanently confined. A reasonable exchange, provided you're not one of the 169."),
      h2('Sources'),
      source('Wikipedia: St Nazaire Raid', 'https://en.wikipedia.org/wiki/St_Nazaire_Raid'),
      source('National Archives UK: Commando Units, Second World War', 'https://www.nationalarchives.gov.uk/help-with-your-research/research-guides/commando-units-second-world-war/'),
      source('Imperial War Museum: Operation Chariot', 'https://www.iwm.org.uk/history/the-raid-on-st-nazaire'),
      source('Lucas, James: Kommando: German Special Forces of World War Two (contextual)', 'https://www.iwm.org.uk/'),
    ]
  },

]

console.log(`\n📰  Publishing Batch 5A — 6 articles\n`)
let ok = 0, fail = 0
for (const a of ARTICLES) {
  process.stdout.write(`  ▸ ${a.title.slice(0, 60)}...\n`)
  try {
    await publish(a)
    console.log(`    ✓ [${a._id}]\n`)
    ok++
  } catch (e) {
    console.log(`    ✗ ${e.message}\n`)
    fail++
  }
  await new Promise(r => setTimeout(r, 400))
}
console.log(`── Result: ${ok} published, ${fail} failed ──`)
