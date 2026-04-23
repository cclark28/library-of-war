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

  // ── 41. OPERATION CHASTISE / DAMBUSTERS — Storyteller ─────────────────────
  {
    _id: 'article-operation-chastise-dambusters',
    _type: 'article',
    title: 'Operation Chastise: The Bouncing Bomb and the Men Who Dropped It',
    slug: { _type: 'slug', current: 'article-operation-chastise-dambusters' },
    publishedAt: '2026-04-23T09:00:00Z',
    excerpt: "On the night of May 16-17, 1943, nineteen Lancasters attacked the Ruhr dams at sixty feet above the water in the dark. Eight aircraft were lost. Two dams were breached. Fifty-three aircrew died. The strategic impact was less than planned. The story has never stopped being told.",
    body: [
      h2('Sixty Feet'),
      p("Not sixty metres. Sixty feet — eighteen metres — above the surface of a reservoir. At night. In a Lancaster bomber, which was not designed for low-level operations and which handled, at low altitude, like what it was: a large four-engine aircraft pressed below its comfortable operating envelope."),
      p("The bouncing bomb — Barnes Wallis's device, cylindrical, spun backward at 500 rpm before release so it would skip across the water, leap the torpedo nets, strike the dam face, and sink to detonating depth — had been tested. It had never been used in combat. And the pilots of 617 Squadron who would deliver it had been practicing for weeks at reservoirs in Wales and Scotland, learning to judge sixty feet at night using two spotlights mounted below the fuselage, angled to converge at the right height."),
      linked(["The operation — ", {text: "codenamed Chastise", href: "https://en.wikipedia.org/wiki/Operation_Chastise"}, " — targeted three dams in the Ruhr industrial region: the Möhne, the Eder, and the Sorpe. The Möhne and Eder were masonry structures; Wallis's bomb was designed specifically for them. The Sorpe was earthen, a different engineering problem with no good solution."]),
      h2('The Möhne'),
      p("Wing Commander Guy Gibson led the first wave against the Möhne Dam. He flew the first run himself, dropped, missed. He flew again to draw anti-aircraft fire while the next aircraft made its approach. Then the next. Gibson flew back and forth over the dam for twenty minutes, drawing fire each time, while aircraft after aircraft ran in below him."),
      p("After five drops, the dam broke. A wave of water ten metres deep and 77 metres wide poured through the breach into the Ruhr valley below. The lights of the searchlights reflected on the flood as it moved downstream."),
      p("The Eder fell on the third drop. The Sorpe survived — it was hit by bombs that crumbled its crest but did not breach it. The earthen design had absorbed what masonry could not."),
      bq('"It\'s gone! It\'s gone! It\'s a definite breach! Good show!" — Gibson, radio call after the Möhne Dam broke'),
      h2('The Cost'),
      linked(["Eight of nineteen Lancasters were lost. ", {text: "Fifty-three of 133 aircrew died", href: "https://www.rafmuseum.org.uk/research/online-exhibitions/dambusters/"}, " — a 40 percent casualty rate among those who flew. Some aircraft were lost to ground fire. Several clipped the reservoir surface and broke apart. One was hit by the shockwave of its own bomb's explosion."]),
      p("The floods killed approximately 1,600 people in the valleys below the dams. The majority were not German civilians. They were forced labourers — Soviet and Ukrainian women, primarily, working in factories along the Ruhr. This part of the story appears less frequently in commemorations of the raid."),
      h2('The Strategic Question'),
      p("The dams were repaired within months. German engineers, working around the clock with forced labour, had the Möhne functional again by September. The production disruption in the Ruhr, while real, was less severe than Wallis had projected. The bombs worked. The dams fell. The strategic effect was incomplete."),
      linked(["What the raid achieved that cannot be measured precisely was psychological and symbolic: a demonstration that German industrial infrastructure was not inviolable, that Bomber Command could identify and strike precision targets deep in the Reich. It was also, straightforwardly, one of the most technically remarkable feats of the air war. The ", {text: "617 Squadron", href: "https://en.wikipedia.org/wiki/No._617_Squadron_RAF"}, " that flew it went on to become the RAF's precision bombing unit for the rest of the war, delivering Tall Boy and Grand Slam bombs against targets conventional bombing could not touch — including the Tirpitz."]),
      h2('Sources'),
      source('Wikipedia: Operation Chastise', 'https://en.wikipedia.org/wiki/Operation_Chastise'),
      source('RAF Museum: The Dambusters', 'https://www.rafmuseum.org.uk/research/online-exhibitions/dambusters/'),
      source('Brickhill, Paul: The Dam Busters (1951) — the original account', 'https://en.wikipedia.org/wiki/The_Dam_Busters_(book)'),
      source('Sweetman, John: The Dambusters Raid (1990)', 'https://www.pen-and-sword.co.uk/'),
    ]
  },

  // ── 42. BATTLE OF KOHIMA (1944) — Quiet Archivist ─────────────────────────
  {
    _id: 'article-battle-of-kohima',
    _type: 'article',
    title: 'Kohima: The Tennis Court Where the Japanese Advance into India Ended',
    slug: { _type: 'slug', current: 'article-battle-of-kohima' },
    publishedAt: '2026-04-23T09:01:00Z',
    excerpt: "The Battle of Kohima, April–June 1944, was fought at 1,500 metres in the Naga Hills between 1,500 defenders and 15,000 Japanese troops. For weeks the fighting was conducted across a tennis court. It was the Japanese Army's largest defeat to that point in the war.",
    body: [
      h2('The Road'),
      linked(["The town of Kohima in northeast India, now Nagaland state, sits astride the road connecting Dimapur and Imphal — the sole supply route to the British garrison at Imphal. ", {text: "Japanese Lieutenant-General Renya Mutaguchi's Fifteenth Army", href: "https://en.wikipedia.org/wiki/Battle_of_Kohima"}, ", executing Operation U-Go in March-April 1944, aimed to cut this road, starve out Imphal, and advance into India. The objective was strategic as much as military: a Japanese presence in India, however temporary, might trigger the collapse of British colonial authority."]),
      p("Kohima was the key to the road. It had to be held or the plan succeeded."),
      h2('The Garrison'),
      p("When the Japanese 31st Division arrived at Kohima on April 4, 1944, the garrison numbered approximately 1,500 men: the 4th Royal West Kent Regiment formed the backbone, reinforced by Indian Army units, Nepalese, and various administrative and non-combatant personnel pressed into service. The Japanese force besieging them was between 12,000 and 15,000."),
      p("The Deputy Commissioner's bungalow sat on a ridge above the town. Its garden contained, among other features, a tennis court — a detail that appears in virtually every account of the battle, because the tennis court changed hands so many times that it became the symbolic centre of the siege."),
      p("The fighting was at ranges measured in yards. At some points, British and Japanese positions were close enough for conversation. Hand grenades replaced artillery as the primary weapon. Men lived in foxholes under constant fire, unable to stand upright, supplied by air drop when the weather permitted and by improvised resupply at other times."),
      h2('The Relief'),
      linked(["On April 20, a column from the 2nd Division, fighting south from Dimapur, broke through to the garrison. This did not end the battle — fighting for the ridge and surrounding terrain continued until late May — but it ended the siege in its acute form. By June 22, ", {text: "the Battle of Kohima was over", href: "https://www.iwm.org.uk/history/the-battle-of-kohima"}, "."]),
      p("The combined battles of Kohima and Imphal cost the Japanese Fifteenth Army approximately 55,000 dead — the largest defeat in Japanese Army history to that point, and a decisive reverse from which the Burma campaign never recovered. The Japanese had expected that Commonwealth forces, once encircled, would break and retreat. They did not."),
      bq('"When you go home, tell them of us and say, for your tomorrow we gave our today." — Epitaph on the 2nd Division memorial at Kohima, the most quoted inscription from any Commonwealth war cemetery'),
      h2('General Slim'),
      linked(["Field Marshal Sir William Slim, commanding the Fourteenth Army, had developed the doctrine that shaped Kohima's defense: positions would hold even when encircled and wait for relief, rather than retreating when cut off. It was a deliberate counter to the Japanese encirclement tactics that had destroyed Allied forces in Malaya and Burma in 1942. At Kohima and Imphal it worked. Slim's account of the campaign, ", {text: "Defeat Into Victory", href: "https://en.wikipedia.org/wiki/Defeat_into_Victory"}, ", is among the finest military memoirs in English."]),
      h2('Sources'),
      source('Wikipedia: Battle of Kohima', 'https://en.wikipedia.org/wiki/Battle_of_Kohima'),
      source('Imperial War Museum: The Battle of Kohima', 'https://www.iwm.org.uk/history/the-battle-of-kohima'),
      source('Slim, William: Defeat Into Victory (1956)', 'https://en.wikipedia.org/wiki/Defeat_into_Victory'),
      source('Kohima Educational Trust', 'https://www.kohimaeducationaltrust.net/'),
    ]
  },

  // ── 43. BATTLE OF LEUCTRA (371 BC) — Careful Scholar ──────────────────────
  {
    _id: 'article-battle-of-leuctra',
    _type: 'article',
    title: 'Leuctra: The Day Sparta Discovered It Was Not Invincible',
    slug: { _type: 'slug', current: 'article-battle-of-leuctra' },
    publishedAt: '2026-04-23T09:02:00Z',
    excerpt: "On July 6, 371 BC, Epaminondas of Thebes attacked the Spartan right wing with a column fifty shields deep. Four hundred Spartiates died. Sparta never recovered. The military system that had dominated Greece for two centuries collapsed in an afternoon in Boeotia.",
    body: [
      h2('The Weight of Reputation'),
      p("Sparta's military reputation was not invented. Spartan citizens — the Spartiates — underwent a systematic militarization from early childhood, the agoge, that produced heavy infantry of exceptional quality and cohesion. The combination of physical training, tactical discipline, and collective identity made Spartan phalanxes formidable opponents across two centuries of Greek interstate conflict."),
      linked(["But the reputation had also become an asset that operated independently of the underlying capability. Armies facing Spartans ", {text: "historically performed below their actual level", href: "https://en.wikipedia.org/wiki/Battle_of_Leuctra"}, " because they believed they would lose. At Plataea in 479 BC, at First Mantinea in 418 BC, Spartan forces had won battles in part because their opponents broke early. Epaminondas of Thebes intended to remove that advantage."]),
      h2('The Tactical Innovations'),
      p("Conventional Greek hoplite deployment placed the strongest units on the right wing of the phalanx, which was the position of honor in Greek tactical tradition. Opposing armies aligned their own right wings against each other; the battle was won by whichever right wing broke the enemy left and then wheeled inward."),
      p("Epaminondas reversed this. He placed his best troops — the Sacred Band of Thebes, 300 elite warriors paired as lovers in the belief that men fight harder beside those they love — on the left wing, aimed directly at the Spartan right, where King Cleombrotus commanded."),
      p("He then deployed his left wing in a column fifty shields deep — approximately four times conventional depth. The mass was not intended to fight on a broad front but to concentrate overwhelming force at a single point and punch through before the rest of the line engaged."),
      p("The oblique advance completed the innovation: Epaminondas led his deep left wing forward while his weaker right wing held back or advanced slowly, so the decisive contact at the critical point came before the rest of the battle was engaged."),
      h2('The Battle'),
      linked(["On ", {text: "July 6, 371 BC", href: "https://www.britannica.com/event/Battle-of-Leuctra"}, ", the massed Theban left struck the Spartan right. Cleombrotus was killed in the initial fighting. The Spartan formation, which expected to be the strongest point on the field, was instead struck by a concentration of force it had no equivalent to."]),
      p("Approximately 400 of the 700 Spartiates present died at Leuctra. This was catastrophic. The citizen warrior class of Sparta — the Spartiates proper, distinct from helots and perioikoi — had been in demographic decline for decades. There were perhaps 1,000 to 1,500 Spartiates remaining at the time of Leuctra. The loss of 400 in a single afternoon was not recoverable."),
      bq('"The Lacedaemonians who had the experience of many battles, yet met their match at Leuctra." — Xenophon, Hellenica'),
      h2('The Consequences'),
      p("Epaminondas did not rest on the tactical innovation. He invaded the Peloponnese repeatedly in subsequent years, reaching Sparta itself — the first time a hostile army had entered Laconia in living memory. He liberated the helots of Messenia, the enslaved population whose labor sustained Spartan society, and founded Megalopolis as a permanent democratic counterweight to Spartan regional power."),
      linked(["Sparta never recovered its previous political position. The ", {text: "Battle of Leuctra", href: "https://en.wikipedia.org/wiki/Battle_of_Leuctra"}, " is generally accepted as the end of Spartan hegemony in Greece. The tactical innovations Epaminondas demonstrated — concentration of force at the decisive point, oblique advance, the deep column — were studied and reapplied by Philip II of Macedon and, through him, by Alexander. The line from Leuctra to Gaugamela is visible in retrospect."]),
      h2('Sources'),
      source('Wikipedia: Battle of Leuctra', 'https://en.wikipedia.org/wiki/Battle_of_Leuctra'),
      source('Xenophon: Hellenica (primary source) — MIT Classics', 'http://classics.mit.edu/Xenophon/hellenica.html'),
      source('Britannica: Battle of Leuctra', 'https://www.britannica.com/event/Battle-of-Leuctra'),
      source('Hanson, Victor Davis: The Western Way of War (contextual)', 'https://www.ucpress.edu/book/9780520260092/the-western-way-of-war'),
    ]
  },

  // ── 44. BATTLE OF POLTAVA (1709) — Old Sergeant ────────────────────────────
  {
    _id: 'article-battle-of-poltava',
    _type: 'article',
    title: 'Poltava: The Battle That Ended Sweden as a Great Power',
    slug: { _type: 'slug', current: 'article-battle-of-poltava' },
    publishedAt: '2026-04-23T09:03:00Z',
    excerpt: "June 27, 1709. Charles XII of Sweden, on crutches from a bullet wound, commanded 20,000 hungry men against 40,000 Russians at Poltava. The battle lasted about two hours. Sweden spent the next century slowly becoming a smaller country.",
    body: [
      h2('The Winter'),
      p("The winter of 1708-09 is remembered in historical meteorology as the worst in European living memory. Rivers froze solid. The Baltic Sea froze solid in places. Temperatures across Europe dropped to levels that killed livestock in their stalls and men in their tents."),
      p("Charles XII's Swedish army was in Ukraine during that winter. They had turned south the previous year, away from Moscow, to link with the Ukrainian Cossack hetman Ivan Mazepa — who had his own reasons for wanting the Russians gone. The move made strategic sense in certain lights. It made no sense at all in that particular winter."),
      linked(["The army that had entered Russia in 1708 with approximately 35,000 men had shrunk to around 20,000 by the time they reached the Ukrainian town of Poltava. They had been short of ammunition since a Russian force destroyed their supply depot at Lesnaya in September. They had been short of food for months. Charles himself had been shot through the foot on ", {text: "June 17, 1709", href: "https://en.wikipedia.org/wiki/Battle_of_Poltava"}, ", ten days before the battle, and was commanding from a litter."]),
      h2('Two Hours'),
      p("Peter the Great's army outnumbered the Swedes by roughly two to one. They were rested and supplied. They had a fortified camp with redoubts that the Swedish infantry had to advance through before engaging the main Russian line."),
      p("The Swedish attack went wrong from the beginning. The infantry got disordered moving through the redoubts. The coordination between cavalry and foot broke down. Mazepa's Cossacks, who were supposed to contribute forces, contributed very little. The assault columns lost cohesion and hit the Russian line piecemeal rather than together."),
      p("The Russian line held and counterattacked. The Swedish army, which had terrified European opponents for a generation, broke in about two hours. Approximately 7,000 Swedes were killed or wounded and another 2,800 captured. Three days later at Perevolochna, the remaining Swedish forces — around 16,000 men — surrendered to pursuit forces when they found the river crossing blocked."),
      bq('"Soldiers, the hour is come that is to decide the fate of Sweden. Let it not be thought that you fight for your king, but for the kingdom." — Charles XII, pre-battle address to his troops at Poltava'),
      h2('Charles Escapes'),
      linked(["Charles escaped with a few hundred cavalry into Ottoman territory, where he remained for five years at the Ottoman court at Bender. He spent this period pressuring the Sultan to declare war on Russia — occasionally successfully, in that two inconclusive wars resulted — and eventually got into a famous incident called the ", {text: "Kalabalik, or Brawling", href: "https://en.wikipedia.org/wiki/Kalabalık"}, ", where his forty bodyguards fought approximately 10,000 Ottoman Janissaries sent to remove him. He was captured but not killed."]),
      p("He returned to Sweden in 1714 and immediately resumed military campaigns, because he had no other mode. He was killed by a bullet at the siege of Fredriksten fortress in Norway in 1718. No one is entirely certain whether it was fired by a Norwegian or a discontented Swede."),
      h2('The Transfer of Power'),
      p("Poltava effectively ended Sweden's status as a major European power. Peter's Russia took the position Sweden had occupied — dominant in the Baltic, significant in European diplomatic calculations — and held it. The transfer was not instant; it took another decade of war to settle formally in the Treaty of Nystad in 1721. But the process began in two hours outside a Ukrainian town on a June morning."),
      h2('Sources'),
      source('Wikipedia: Battle of Poltava', 'https://en.wikipedia.org/wiki/Battle_of_Poltava'),
      source('Britannica: Battle of Poltava', 'https://www.britannica.com/event/Battle-of-Poltava'),
      source('Englund, Peter: The Battle That Shook Europe — Poltava and the Birth of the Russian Empire (2003)', 'https://en.wikipedia.org/wiki/The_Battle_That_Shook_Europe'),
      source('Fuller, William C.: Strategy and Power in Russia 1600-1914 (contextual)', 'https://www.simonandschuster.com/'),
    ]
  },

  // ── 45. NIGHT OF THE LONG KNIVES — Dry Observer ───────────────────────────
  {
    _id: 'article-night-of-the-long-knives',
    _type: 'article',
    title: 'The Night of the Long Knives: Hitler Murdered His Own Allies and Was Congratulated',
    slug: { _type: 'slug', current: 'article-night-of-the-long-knives' },
    publishedAt: '2026-04-23T09:04:00Z',
    excerpt: "On June 30, 1934, the German government murdered several hundred of its own citizens, including a sitting general and a former Chancellor. Three weeks later, the Reich Cabinet passed a law declaring the killings legal. President Hindenburg sent a telegram of congratulations.",
    body: [
      h2('The SA Problem'),
      linked(["The Sturmabteilung — the SA, the Nazi brownshirts — had been essential to Hitler's rise to power. By 1934 it numbered approximately 2.5 million men and was commanded by Ernst Röhm, one of Hitler's oldest political associates and among the few who addressed him with the familiar 'du.' Röhm wanted to merge the SA with the Reichswehr, the professional German military, and command the result. The ", {text: "Reichswehr's officer corps", href: "https://en.wikipedia.org/wiki/Night_of_the_Long_Knives"}, " found this prospect deeply unwelcome."]),
      p("So did Heinrich Himmler and Hermann Göring, who had their own reasons for wanting Röhm removed. They presented Hitler with a dossier alleging that Röhm was planning a coup. The evidence was fabricated, though historians debate the extent to which Hitler knew this or chose to treat the fabrication as useful regardless of its accuracy."),
      p("The operation also provided an opportunity. Various political enemies who had nothing to do with the SA could be killed under cover of the emergency."),
      h2('The Killings'),
      p("On June 30 and July 1, 1934, SA leaders were arrested across Germany and shot. Röhm was confronted in his room at the Hanslbauer Hotel in Bad Wiessee, arrested, and taken to Stadelheim Prison. He was given a loaded pistol and invited to shoot himself. He declined. Two SS officers shot him in his cell."),
      linked(["The operation also killed ", {text: "Kurt von Schleicher, former Chancellor of Germany", href: "https://www.britannica.com/biography/Kurt-von-Schleicher"}, ", who was shot at his home along with his wife. Erich Klausener, head of Catholic Action, was shot in his office at the Transportation Ministry. Gregor Strasser, once Hitler's primary rival within the Nazi Party, was shot in his prison cell. Gustav Ritter von Kahr, who had helped suppress Hitler's 1923 putsch attempt, was hacked to death with picks."]),
      p("The official death toll was 85. The actual number was higher — estimates range to 200 and beyond. No autopsies were performed. No trials were held."),
      bq('"If anyone reproaches me and asks why I did not resort to the regular courts of justice, then all I can say is this: In this hour I was responsible for the fate of the German people, and thereby I became the supreme judge of the German people." — Hitler, speech to the Reichstag, July 13, 1934'),
      h2('The Response'),
      p("President Paul von Hindenburg, who had spent 1932 and 1933 reassuring German conservatives that he could control Hitler, sent a telegram. It congratulated Hitler on his 'resolute and courageous personal intervention' which had 'nipped treason in the bud.'"),
      p("The Reichswehr stood aside. The officer corps, which had viewed the SA as a threat to its institutional monopoly on military force, was relieved to see Röhm gone. They did not protest the murder of Schleicher, one of their own. They accepted Hitler's version of events."),
      linked(["Three weeks later, the Reich Cabinet passed a law — retroactively, as these things go — declaring the killings to have been legal as an act of state self-defense. Germany's conservative establishment, which had spent years telling itself and each other that ", {text: "Hitler could be managed", href: "https://www.ushmm.org/learn/timeline-of-events/1933-1938/night-of-the-long-knives"}, ", had just watched him murder his sponsors, his rivals, and several inconvenient witnesses in a single weekend. They concluded this was acceptable."]),
      p("It was the clearest signal yet of what German political life had become. It was also, for most of those who should have heeded it, the last warning they received before things became considerably worse."),
      h2('Sources'),
      source('Wikipedia: Night of the Long Knives', 'https://en.wikipedia.org/wiki/Night_of_the_Long_Knives'),
      source('US Holocaust Memorial Museum: Night of the Long Knives', 'https://www.ushmm.org/learn/timeline-of-events/1933-1938/night-of-the-long-knives'),
      source('Evans, Richard J.: The Third Reich in Power (2005)', 'https://www.penguinrandomhouse.com/books/286818/the-third-reich-in-power-by-richard-j-evans/'),
      source('Britannica: Night of the Long Knives', 'https://www.britannica.com/event/Night-of-the-Long-Knives'),
    ]
  },

  // ── 46. BATTLE OF LONG ISLAND (1776) — Storyteller ────────────────────────
  {
    _id: 'article-battle-of-long-island',
    _type: 'article',
    title: "Long Island: Washington's Worst Day, and the Fog That Saved Everything",
    slug: { _type: 'slug', current: 'article-battle-of-long-island' },
    publishedAt: '2026-04-23T09:05:00Z',
    excerpt: "The Battle of Long Island, August 1776, was a catastrophe. The British flanked the Americans through an unguarded pass and nearly destroyed the Continental Army in its first real engagement. Then a fog came in at exactly the right moment. George Washington was never fully comfortable attributing this to God, but he never stopped being grateful.",
    body: [
      h2('The Jamaica Pass'),
      p("Five men. Washington had posted five cavalry pickets on the Jamaica Pass — a road wide enough to march an army through, running through the hills east of Brooklyn. It was the farthest of three passes across the Heights of Guan, and perhaps someone had calculated that the distance made it unlikely."),
      linked(["General William Howe's Chief of Staff, Henry Clinton, saw it differently. He proposed a flanking march through the Jamaica Pass with 10,000 men — the bulk of the British and Hessian force — while a smaller force demonstrated against the two defended passes. On the night of ", {text: "August 26-27, 1776", href: "https://en.wikipedia.org/wiki/Battle_of_Long_Island"}, ", 10,000 soldiers marched quietly through the dark and were behind the American forward positions before dawn."]),
      p("The five pickets were captured. No alarm was raised. The American commanders on the Heights of Guan had no idea anyone was behind them until, around nine in the morning, they heard firing in their rear."),
      h2('The Trap Closes'),
      p("The British frontal attacks across the other passes came in simultaneously. The American forward defense — around 5,000 men strung out across the Heights — found themselves between Hessians in front and British regulars behind. Two brigades were effectively destroyed in the morning fighting."),
      p("Lord Stirling's Maryland Regiment — some 400 men under William Alexander, who claimed a Scottish earldom that the British House of Lords had declined to recognize — made a suicidal charge against the British rear to cover the retreat. They attacked. They retreated. They attacked again. Each attack bought minutes for their comrades to reach the water behind them. Perhaps 250 of 400 Marylanders were killed or captured."),
      p("Washington, watching from the Brooklyn Heights, reportedly said: 'Good God, what brave fellows I must this day lose.' He was not wrong."),
      h2('The Heights'),
      p("The Continental Army retreated to prepared positions on Brooklyn Heights and dug in. The British trenches crept forward — Howe, cautious as always, preferred siege approaches to another frontal assault of the Bunker Hill type. In three days, perhaps four, his engineers would be close enough to storm the works, and the American army would be destroyed or captured against the river."),
      p("Washington began moving his artillery to Manhattan. He told no one else what he was planning."),
      bq('"The necessity of being ready to oppose the worst, requires that the utmost force should be collected." — Washington, writing to Congress during the Long Island campaign'),
      h2('The Fog'),
      linked(["On the night of August 29, Washington ordered a secret evacuation. ", {text: "Colonel John Glover's Massachusetts Marblehead fishermen", href: "https://en.wikipedia.org/wiki/Glover%27s_Regiment"}, " — sailors and fishermen who had joined the Continental Army as a regiment — began moving the army across the East River in every boat they could find. Nine thousand men, plus artillery. Under silence orders. No talking, no coughing, horses muffled. The eastern sky would gray by around 5 AM."]),
      p("The fog came before the eastern sky grayed. Thick, staying fog that grounded the British fleet and reduced visibility to almost nothing. The last boats left the Brooklyn shore as dawn came. The fog lifted about an hour later."),
      p("The army was across. The campaign for New York was lost — Washington would lose Manhattan in September, nearly lose his army at Kip's Bay, and spend the autumn retreating across New Jersey. But he had the army."),
      p("He spent the next six years keeping the army intact, avoiding the kind of decisive engagement that had nearly destroyed it at Long Island, living to fight again. The strategy required extraordinary patience and a willingness to absorb apparent defeat. It worked because he had gotten the army across the river in the dark under a fog that lifted, as if on cue, once the last boat landed. He was pious about things like this for the rest of his life. Given the timing, it is difficult entirely to blame him."),
      h2('Sources'),
      source('Wikipedia: Battle of Long Island', 'https://en.wikipedia.org/wiki/Battle_of_Long_Island'),
      source('National Park Service: Battle of Long Island', 'https://www.nps.gov/places/battle-of-long-island.htm'),
      source('McCullough, David: 1776 (2005)', 'https://www.simonandschuster.com/books/1776/David-McCullough/9780743226721'),
      source('Library of Congress: American Revolution primary sources', 'https://www.loc.gov/collections/american-revolution-and-its-era/'),
    ]
  },

]

console.log(`\n📰  Publishing Batch 5B — 6 articles\n`)
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
