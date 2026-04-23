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

async function publish(article) {
  const r = await fetch(`${BASE}/mutate/${DATASET}?returnDocuments=false`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ mutations: [{ createOrReplace: article }] })
  })
  if (!r.ok) throw new Error(await r.text())
}

const ARTICLES = [

  // ── 25. FALL OF CONSTANTINOPLE — Dry Observer ──────────────────────────────
  {
    _id: 'article-fall-of-constantinople',
    _type: 'article',
    title: 'The Fall of Constantinople: The End of Rome, Give or Take a Thousand Years',
    slug: { _type: 'slug', current: 'article-fall-of-constantinople' },
    publishedAt: '2026-04-22T08:00:00Z',
    excerpt: 'On May 29, 1453, the city that had survived the Huns, the Avars, the Arabs, and the Crusaders — who helpfully sacked it themselves in 1204 — finally fell. The Ottoman sultan wept at the ruins. He had wanted the city intact.',
    body: [
      h2('The Empire That Refused to Notice It Was Gone'),
      p('By 1453, the Byzantine Empire controlled roughly the size of a prosperous suburb. It held Constantinople itself, a scattering of islands, and some coastal territories. It still called itself the Roman Empire. Old habits die hard.'),
      p('The city\'s population had declined from perhaps 400,000 at its medieval peak to somewhere between 40,000 and 50,000. Its walls dated from the reign of Theodosius II, completed in 439 AD. They had been impressive in the fifth century. The question, in 1453, was whether they would be impressive enough in the fifteenth.'),
      p('The answer, after fifty-three days, was no.'),
      h2('The Sultan and the Cannon'),
      p('Sultan Mehmed II was twenty-one years old and had spent his entire young life thinking about Constantinople. He brought an army of 80,000 to 100,000 men. He brought a fleet. And he brought a cannon, designed by a Hungarian engineer named Urban, that could throw a 600-pound stone ball at the walls.'),
      p('Urban had first offered his services to the Byzantines. They couldn\'t afford him.'),
      p('The cannon was so large it took sixty oxen to move and could fire seven times a day. After each shot, the wall sections would crumble. The Byzantines would patch them at night with rubble and timber. Then the cannon would fire again in the morning. This continued for fifty-two days.'),
      h2('The Defenses'),
      p('Inside the walls were perhaps 7,000 defenders: Byzantine soldiers, Genoese mercenaries under the competent Giovanni Giustiniani, and a handful of Venetians and volunteers from various nations who had elected to be present for what everyone understood was likely the end of something important.'),
      p('Emperor Constantine XI Palaiologos commanded. He had been emperor for four years. He knew what was coming. He had sent ambassadors to every Western court asking for help. The help did not arrive. The help was never going to arrive. The Catholic-Orthodox schism had seen to that, along with the general principle that foreign powers are more useful to petition than to rely upon.'),
      p('Constantine stayed anyway.'),
      h2('The Dragging of the Fleet'),
      p('When the Byzantine chain boom across the Golden Horn blocked the Ottoman fleet, Mehmed ordered his ships dragged overland on greased wooden rollers, around the boom, and relaunched in the harbor behind it. This maneuver, completed in a single night, placed Ottoman vessels in a position to attack the walls from the water as well as the land.'),
      p('It is the sort of logistical improvisation that military historians note with admiration. The Byzantines, watching from the walls, noted it with something closer to despair.'),
      h2('The Gate'),
      p('On the night of May 28, Constantine gave a speech. He asked forgiveness for any offenses he had given, embraced his commanders, and went to pray. Then he went to the walls.'),
      p('The final assault began at 1:30 AM on May 29. Waves of Ottoman forces struck the walls repeatedly. Giustiniani was wounded and withdrew — his departure caused a panic among the defenders, who saw their most capable commander being carried to the rear.'),
      p('And then someone left a gate open. Or a postern gate was found unlocked. The accounts are inconsistent. What they agree on is that a small Ottoman force found their way inside the walls while the main assault was still ongoing outside. The word spread: the Turks are inside.'),
      p('That was that.'),
      bq('"The city is taken and I am still alive." — Constantine XI Palaiologos, last words attributed to him before charging into the fighting'),
      h2('The Aftermath'),
      p('Constantine removed his imperial regalia and charged into the melee. He was never seen again. His body was identified later, allegedly, by the purple boots. The last Roman emperor died in the streets of the city Romulus had founded, by a different story, in 753 BC.'),
      p('Mehmed entered the city in the afternoon. He rode to the Hagia Sophia — the largest cathedral in the world for a thousand years — and had it converted to a mosque before evening. Then, according to multiple sources, he wept at the damage to the city and quoted a Persian poet: "The spider weaves the curtains in the palace of the Caesars; the owl calls the watches in the towers of Afrasiab."'),
      p('Or he didn\'t say that. The quote may be apocryphal. But the weeping has some credibility. He had wanted the city intact. He got most of it.'),
      p('The Eastern Roman Empire, which had been dying slowly since the Visigoths sacked Rome in 410, was now definitively dead. The Ottoman Empire would rule from Constantinople — which it called Istanbul — for another 469 years. The Russians, who considered themselves the inheritors of Byzantine civilization, would argue about this for centuries. Some still are.'),
    ]
  },

  // ── 26. BATTLE OF AGINCOURT — Storyteller ──────────────────────────────────
  {
    _id: 'article-battle-of-agincourt',
    _type: 'article',
    title: 'Agincourt: Mud, Stakes, and the Arrow That Changed England',
    slug: { _type: 'slug', current: 'article-battle-of-agincourt' },
    publishedAt: '2026-04-22T08:01:00Z',
    excerpt: 'Henry V\'s army was starving, sick, and outnumbered three to one. The French had blocked the road home. On October 25, 1415, 6,000 exhausted men walked into the gap between two forests and did something that no one who survived it ever forgot.',
    body: [
      h2('The Road Home Was Blocked'),
      p('The rain had not stopped for two days. The field between the woods of Tramecourt and Agincourt had been churned to knee-deep mud by the movement of tens of thousands of armoured men and horses, and the English who would have to cross it had not eaten a proper meal in two weeks.'),
      p('Henry V\'s army was dying. Not in battle, not yet, but slowly, from dysentery and exhaustion and the relentless mathematics of a forced march through hostile country. They had left Harfleur with perhaps 9,000 men. They were down to somewhere around 6,000 by the time the French barred the road at the village of Agincourt on October 24, 1415.'),
      p('The French numbered between 12,000 and 36,000, depending on the source. English chronicles said 60,000, which is the kind of number you write when you need readers to understand the scale of what happened next. What was not in dispute was the imbalance. The French had more men than the English had soldiers. They had chosen this ground. They had time.'),
      h2('The Night Before'),
      p('Henry moved through his camp that night. The men were quiet, afraid, half-ruined by illness. They knew what the morning would bring. Some of them confessed to priests. Some of them sharpened blades they had barely used. Some of them dug into provisions that were almost gone and ate whatever remained.'),
      p('Henry was twenty-eight years old. He had been king for four years. He had never fought a major battle, had never commanded at this scale, had never faced anything like the force drawn up across the Agincourt field. He also never, by any account, showed his men that he was frightened.'),
      p('The French, a few hundred metres away, were in better spirits. There were reports of gambling over which knights would get the honor of capturing the English king. They had so many men they were worried about getting in each other\'s way. They planned to attack on foot, mostly, since horses struggled in the mud. They planned to wait for morning and then simply overwhelm what remained of the English force.'),
      h2('The Stakes'),
      p('Henry deployed his longbowmen, perhaps 5,000 of them, in a line flanked by the two forests that narrowed the battlefield. Each archer hammered a sharpened stake into the earth in front of him, angled toward the enemy, to break a cavalry charge. Then they waited.'),
      p('The French didn\'t move.'),
      p('They were going to wait him out. They had supplies. The English did not. In a few days, Henry\'s men would be too weak to fight. Simple. Patient. Correct.'),
      p('Which was why Henry did the thing that was completely insane. He ordered his entire army forward, into longbow range of the French line, and then halted and had his archers plant their stakes again. Then the English archers opened fire.'),
      h2('The Charge'),
      p('The first French cavalry charge came through a storm of arrows. The field was sixty metres wide between the two forests at the narrowest point — not enough room for a cavalry force to spread and flank, only to charge straight ahead through the mud into the arrows.'),
      p('Horses screamed and went down. Knights fell and could not rise; the mud held them down, their armour sealed them in. The men-at-arms behind the cavalry had to pick their way through fallen horses and thrashing knights and bodies. By the time the French reached the English line, they had been walking through hell for three minutes and were exhausted before the hand-to-hand fighting began.'),
      p('The English longbowmen, when their arrows ran out or the French got too close, dropped their bows, picked up mallets and hatchets and the swords of the dead, and went in among the fallen French like harvesters.'),
      bq('"We few, we happy few, we band of brothers." — Shakespeare\'s Henry V, written 185 years after the battle, but capturing something real about what the survivors carried home'),
      h2('The Count'),
      p('The battle lasted perhaps three hours. France lost between 6,000 and 10,000 men — dead or captured — including three dukes, ninety lords, and over fifteen hundred knights. England lost somewhere between 112 and 400, depending on the source and what counts as a casualty.'),
      p('Among the French dead were the Constable of France, the Admiral of France, the Master of the Crossbowmen, and the Grand Master of the Household. The flower of French nobility lay in the mud of Agincourt and did not get up.'),
      p('Henry rode across the field and thanked God. It is hard to blame him. He had walked a sick, starving army into the teeth of a force that outnumbered it three to one, and had come out the other side with a victory so complete that historians would argue about it for six centuries.'),
      p('It wasn\'t a miracle, exactly. It was stakes, and mud, and the patience to let your enemy make the first bad decision. Henry had made his bet on the ground, on the weather, on the weapon his yeomen had trained with since boyhood. The bet paid.'),
      p('He rode home to England and a welcome that, by all accounts, he found excessive. He had more campaigning to do. There was always more campaigning to do.'),
    ]
  },

  // ── 27. SIEGE OF DIEN BIEN PHU — Quiet Archivist ───────────────────────────
  {
    _id: 'article-siege-of-dien-bien-phu',
    _type: 'article',
    title: 'Dien Bien Phu: The Assumption That Killed an Empire',
    slug: { _type: 'slug', current: 'article-siege-of-dien-bien-phu' },
    publishedAt: '2026-04-22T08:02:00Z',
    excerpt: 'The French fortress at Dien Bien Phu was built on a single military assumption: that General Giap could not move heavy artillery through the jungle mountains. He could. The garrison surrendered after 55 days. France\'s war in Indochina was over.',
    body: [
      h2('The Assumption'),
      p('The French garrison at Dien Bien Phu was constructed on the premise that the surrounding terrain made it impregnable to heavy artillery. The hills rising to 1,000 metres on all sides of the valley would prevent General Vo Nguyen Giap from positioning guns at useful elevations. Any artillery moved to the ridgelines would be visible, exposed, and vulnerable to French air power.'),
      p('This analysis was not unreasonable given conventional assumptions about what was possible in that terrain. It was wrong.'),
      p('Giap moved 105mm howitzers, 75mm recoilless rifles, and 37mm anti-aircraft guns through the jungle in pieces, disassembled, carried by hand and on bicycle by an estimated 50,000 soldiers and porters along supply lines stretching hundreds of kilometres. He positioned them on the reverse slopes of the surrounding hills, in concealed and tunnelled emplacements where they could fire while remaining invisible to French observation aircraft.'),
      p('The first salvos landed on the morning of March 13, 1954.'),
      h2('Colonel Piroth'),
      p('Brigadier General Christian de Castries commanded the garrison. His artillery was under Colonel Charles Piroth, who had personally assessed the position and told his commanders that he could silence any artillery Giap brought to the ridgelines within fifteen minutes of its opening fire.'),
      p('Piroth\'s assessment was based on the visibility of the ridgelines. Artillery on exposed ridgelines could be located by flash and sound ranging and destroyed from the air. Artillery on reverse slopes, in tunnels, could not.'),
      p('On March 13, Béatrice strongpoint was struck and fell within hours. Piroth\'s counterbattery fire had no observable effect on the Viet Minh guns. He could not locate them. That evening, Piroth retired to his dugout and shot himself.'),
      p('He left no note. His reasoning seems clear enough from the circumstances.'),
      h2('The Strongpoints'),
      p('The garrison was organized into a central position and several outlying strongpoints, each named after a woman — Béatrice, Gabrielle, Anne-Marie, Huguette, Claudine, Dominique, Eliane. The naming convention has been attributed to de Castries\' mistresses, to a staff joke, and to routine administrative practice. The evidence is ambiguous.'),
      p('Béatrice fell on the night of March 13. Gabrielle fell on March 15. Anne-Marie was abandoned on March 17. Three of the eight strongpoints were gone in the first four days.'),
      p('Giap\'s method was systematic. His infantry dug approach trenches, advancing them nightly until they were within assault distance of a French position. Artillery support suppressed the defenders. An assault followed. Each strongpoint was isolated before being attacked.'),
      h2('The Airstrip'),
      p('Resupply of the garrison depended entirely on air delivery. The airstrip in the valley floor became unusable under artillery fire by late March. From that point, supplies were dropped by parachute. A substantial portion landed outside the French perimeter.'),
      p('French aircraft flew 10,400 sorties during the battle and lost 62 planes to anti-aircraft fire. The airlift delivered approximately 4,000 tons of supplies over 55 days — far below the garrison\'s minimum requirements.'),
      p('The United States, which was funding approximately 80 percent of the French war effort, considered direct military intervention. A proposal to use American B-29s in "Operation Vulture" was discussed at the highest levels and ultimately declined, primarily because British opposition made a multilateral coalition impossible and the Eisenhower administration was unwilling to act unilaterally.'),
      bq('"We are now at Dien Bien Phu. We are living minute by minute." — de Castries, radio transmission, May 7, 1954'),
      h2('The Fall'),
      p('On May 7, 1954 — one day before the opening of the Geneva Conference that would determine the future of Indochina — the last French resistance in the central position ended. De Castries was captured. Approximately 11,721 French Union soldiers went into prisoner-of-war camps. Of these, roughly 3,000 would survive to repatriation.'),
      p('The high mortality in captivity resulted from a combination of wounds, illness, exhaustion, and the conditions of camps that were not equipped for large numbers of prisoners.'),
      p('At Geneva, Vietnam was partitioned at the 17th parallel. The Democratic Republic of Vietnam would administer the north; the State of Vietnam the south. The partition was intended to be temporary, pending elections in 1956. The elections were never held.'),
      p('The United States, having watched France lose its war, began planning its own involvement. The assumptions that guided that planning would, over the next two decades, prove similarly costly.'),
    ]
  },

  // ── 28. BATTLE OF STALINGRAD — Careful Scholar ─────────────────────────────
  {
    _id: 'article-battle-of-stalingrad',
    _type: 'article',
    title: 'Stalingrad: The Battle That Broke the Wehrmacht',
    slug: { _type: 'slug', current: 'article-battle-of-stalingrad' },
    publishedAt: '2026-04-22T08:03:00Z',
    excerpt: 'Two million people died between August 1942 and February 1943 in a city on the Volga. Germany never mounted another major offensive in the east. The symbolic logic that made Stalingrad undamageable to either side created the most destructive urban battle in history.',
    body: [
      h2('Why Stalingrad'),
      p('It is worth understanding what the Battle of Stalingrad was originally supposed to be before examining what it became. Hitler\'s 1942 summer offensive, Case Blue, was aimed primarily at the Caucasus oil fields, which Germany required to sustain its mechanized forces. Stalingrad was a secondary objective: an industrial center and a crossing point on the Volga river, important but not the primary target.'),
      p('What transformed Stalingrad into the central contest of the Eastern Front was symbolic logic operating on both sides simultaneously. Stalin refused to permit the evacuation of a city bearing his name. Hitler became personally invested in its capture to the point that the campaign\'s resources were redirected toward it. By late summer 1942, neither side could afford to lose Stalingrad regardless of its actual strategic value.'),
      p('The result was that the oil fields Germany needed were never reached, while two armies destroyed each other in a ruined factory city on the steppe.'),
      h2('The Method of Defense'),
      p('Vasily Chuikov, commander of the Soviet 62nd Army defending the city, developed a tactical approach that has been extensively studied in military literature. He called it "hugging" the enemy: keeping his forces so close to German positions that German air power and artillery could not be employed without hitting German units.'),
      p('The logic was that the Luftwaffe, which had destroyed Soviet forces in open ground throughout 1941 and 1942, could not bomb positions intermingled with German troops. At ranges of twenty to fifty metres — sometimes less — aircraft were useless and artillery became dangerous to both sides. The battle devolved into small-unit combat in the rubble, where Soviet defenders who knew the terrain had significant advantages over German attackers.'),
      p('Chuikov also implemented a policy of fighting at night and using the banks of the Volga as his supply line, maintaining the narrowest possible frontage that German forces were forced to compress to attack.'),
      h2('The Factories'),
      p('The fighting in the Barrikady gun factory, the Stalingrad Tractor Plant, and the Red October steel works became a distinct subset of the battle with its own logic. Individual rooms, stairwells, and pipeline junctions were contested for days. Floors of buildings changed hands multiple times in a single day.'),
      p('A building held by Sergeant Yakov Pavlov and a platoon of roughly 25 men — known subsequently as Pavlov\'s House — was defended for 58 days from September 27 to November 25, 1942. Soviet accounts claim it killed more Germans than the fall of Paris. This is almost certainly an exaggeration. It is also not entirely implausible given the nature of the fighting.'),
      p('German soldiers called Stalingrad the Rattenkrieg — the war of rats. The scale of human misery involved in clearing buildings room by room, in winter, with weapons designed for open-field combat, cannot be precisely quantified.'),
      bq('"We have fought for fifteen days for a single house, with mortars, grenades, machine guns and bayonets. Already by the third day fifty-four German corpses are strewn in the cellars, on the landings, and the staircases." — German officer, quoted in Vasily Grossman\'s notes'),
      h2('Operation Uranus'),
      p('The decisive action at Stalingrad did not occur within the city. It occurred on the flanks.'),
      p('Soviet operational planning, conducted under strict secrecy through October and November 1942, identified the flanks of the German 6th Army as vulnerable. These flanks were held by Romanian, Italian, and Hungarian formations that were less well-equipped, less well-trained, and less well-supplied than German units. The Soviets concentrated armored forces opposite these flanks while German attention remained fixed on the city.'),
      p('Operation Uranus launched on November 19 in the north and November 20 in the south. Within four days, the two armored pincers had met at Kalach, encircling the entire German 6th Army — approximately 300,000 men — within a pocket roughly 40 kilometres across.'),
      p('German relief attempts were mounted but failed to break through. Hermann Göring guaranteed Hitler that the Luftwaffe could supply the encircled army by air. This required delivering approximately 700 tons per day. The maximum achieved was around 300 tons. On most days, it was significantly less.'),
      h2('The Surrender'),
      p('Friedrich Paulus, commanding the 6th Army, repeatedly requested permission to attempt a breakout while his forces retained the strength to do so. Hitler refused. Stalingrad was declared a fortress. Paulus was promoted to Field Marshal on January 30, 1943 — no German field marshal had ever surrendered. Hitler appears to have expected Paulus to kill himself.'),
      p('Paulus surrendered on February 2, 1943. He lived until 1957, cooperated with Soviet authorities during the war, and after the war testified at Nuremberg.'),
      p('German and Axis military deaths at Stalingrad are estimated at 400,000 to 500,000. Soviet military deaths at around 500,000. Civilian deaths are difficult to establish precisely but run into the tens of thousands. The total approaches two million when all categories are combined.'),
      p('The Eastern Front never recovered its pre-Stalingrad character. Germany launched no further major offensive operations on the eastern theatre. The strategic initiative passed to the Soviet Union and did not return. The war in the east would last another two years, but its outcome was determined on the Volga in the winter of 1942 to 1943.'),
    ]
  },

  // ── 29. OPERATION BARBAROSSA — Old Sergeant ────────────────────────────────
  {
    _id: 'article-operation-barbarossa',
    _type: 'article',
    title: 'Operation Barbarossa: The War That Was Supposed to Be Over Before Winter',
    slug: { _type: 'slug', current: 'article-operation-barbarossa' },
    publishedAt: '2026-04-22T08:04:00Z',
    excerpt: 'Three million German soldiers crossed into the Soviet Union on June 22, 1941, on a 2,900-kilometre front. Stalin had been warned. He didn\'t believe it. The opening was catastrophic. And then, somehow, it wasn\'t enough.',
    body: [
      h2('The Warning That Wasn\'t Heeded'),
      p('June 22, 1941. Three million German soldiers crossed into the Soviet Union simultaneously, on a front nearly 3,000 kilometres wide. Stalin had been warned it was coming. His own intelligence had given him the date. British intelligence had given him the date. German deserters had crossed the wire specifically to warn him.'),
      p('He called it provocation. He ordered his border units not to respond to German overflights. He insisted his troops maintain defensive postures and not take any action that could be interpreted as aggression. He seems to have genuinely believed that Germany, which was still at war with Britain, would not open a second front before finishing the first.'),
      p('He was wrong in a way that cost the Soviet Union somewhere between twenty-six and twenty-seven million dead over the next four years.'),
      h2('The First Day'),
      p('The Luftwaffe hit Soviet airfields at 3:15 in the morning. Most of the Red Air Force was on the ground. The pilots were in their barracks. By noon, Soviet losses had reached approximately 1,200 aircraft — some accounts say higher. The actual number no longer mattered. The point was air superiority over the entire front, achieved in a morning.'),
      p('German armoured columns were forty, fifty, sixty kilometres inside Soviet territory before Soviet units received orders to resist. Some units never received orders at all. Communication lines were cut. Headquarters were bombed. Commanders who did fight back risked being accused of provocation.'),
      p('The border guards who contacted Moscow in those first hours were told they must be mistaken.'),
      h2('The Encirclements'),
      p('What followed was the most catastrophic sequence of military defeats in modern history. The Wehrmacht\'s method was the armoured encirclement — panzers driving deep and fast on both flanks of a Soviet formation, meeting behind it, and then holding the ring while infantry moved up to destroy what was trapped inside.'),
      p('At Bialystok-Minsk in June and July: 300,000 prisoners. At Uman in August: 103,000. At Kiev in September: 650,000. That was the largest encirclement in military history. Six hundred and fifty thousand men. A figure that sounds wrong until you check it again and it still says 650,000.'),
      p('At Vyazma-Bryansk in October: another 600,000. By December 1941, total Soviet casualties — dead, wounded, and captured — stood at approximately five million.'),
      p('The Red Army in 1941 was not the Red Army of 1943. Stalin\'s purges of 1937 and 1938 had killed or imprisoned most of its experienced senior officers. The men who knew how to fight were dead or in camps. The men who replaced them were terrified of being next.'),
      bq('"This world war will not end as the Jews imagine, with the extermination of the European-Aryan peoples, but the result will be the annihilation of Jewry." — Hitler, speaking on the eve of Barbarossa, revealing that the campaign\'s ideology was not an addendum'),
      h2('The Problem With Everything'),
      p('And yet the whole thing was coming apart even as it succeeded. Hitler had three strategic objectives: Leningrad in the north, Moscow in the center, and the Caucasus oil fields in the south. His generals, almost unanimously, told him to concentrate on Moscow first. Take the communications hub. Collapse the rail network. End the war before winter.'),
      p('Hitler disagreed. He sent armour south to help at Kiev, then north toward Leningrad, then south again. He could not decide which objective mattered most and so pursued all three with forces that were barely sufficient for one.'),
      p('The German army reached the outskirts of Moscow in December. Soldiers reported they could see the Kremlin spires through binoculars. Then the temperature dropped to minus thirty Celsius, and the German army — issued summer uniforms because the war was supposed to be over in six weeks — learned what minus thirty Celsius actually means.'),
      p('Engines wouldn\'t start. Grease froze solid. Frostbite cases outnumbered battle casualties. Rifles wouldn\'t fire.'),
      h2('The Siberian Divisions'),
      p('The Soviets had moved their Siberian divisions west. Men who were trained for winter combat, equipped for winter combat, and had spent their careers in conditions that killed German soldiers through exposure. They hit the exhausted German lines on December 5, 1941.'),
      p('The Germans fell back. Not far, not fast, but they fell back. They had reached the furthest point of Barbarossa\'s advance. They would never again be as close to winning as they were in the first six months of the campaign.'),
      p('A war that didn\'t end in 1941 could not be won by Germany. They didn\'t have the population for a long war. They didn\'t have the industrial capacity. They didn\'t have the oil. They had gambled everything on a fast win, and the fast win had been close — agonizingly close — but it hadn\'t happened.'),
      p('The Soviet Union had six months of catastrophe behind it and years of catastrophe ahead of it. It kept fighting. The industrial capacity moved east of the Urals kept producing. The Lend-Lease supplies from Britain and America kept arriving. And eventually the numbers caught up.'),
      p('Barbarossa failed. Everything that followed for Germany was a consequence of that failure.'),
    ]
  },

  // ── 30. BATTLE OF BRITAIN — Dry Observer ───────────────────────────────────
  {
    _id: 'article-battle-of-britain',
    _type: 'article',
    title: 'The Battle of Britain: A War of Attrition Won by Paperwork',
    slug: { _type: 'slug', current: 'article-battle-of-britain' },
    publishedAt: '2026-04-22T08:05:00Z',
    excerpt: 'The Battle of Britain is remembered as a heroic struggle of the few against the many. It was also, in substantial part, a competition between two countries\' administrative systems. The side with the more functional one won.',
    body: [
      h2('The Plan'),
      p('The German plan was called Operation Sea Lion: invade Britain. The prerequisite was air superiority over the English Channel and southern England. The Luftwaffe would destroy the Royal Air Force. The Wehrmacht would then cross the water. This was straightforward in concept and, as it turned out, rather more complicated in practice.'),
      p('Reichsmarschall Hermann Göring guaranteed Hitler that the Luftwaffe could eliminate the RAF in four weeks. He said this on August 1, 1940. He was still saying it, with adjustments, in September. The main adjustment was that the timeframe had quietly expanded.'),
      h2('The Accounting Problem'),
      p('The central tactical difficulty the Luftwaffe faced was one that is easier to see in retrospect than it was to see at the time: destroying a modern air force is not like destroying a field army. A field army can be encircled. An air force cannot.'),
      p('When a German pilot was shot down over southern England, he spent the rest of the war in a prisoner-of-war camp, probably in the north of England. His aircraft was scrap. His experience was permanently removed from German order of battle.'),
      p('When a British pilot was shot down over southern England, he parachuted into a field, was collected by a farmer or a Home Guard volunteer, driven to the nearest airfield, and was frequently back in a cockpit within forty-eight hours. His aircraft was replaced. His experience remained in circulation.'),
      p('German intelligence consistently overestimated RAF losses and underestimated replacements. The intelligence failure was significant enough that by September, German planners believed Fighter Command to be on the verge of collapse when in fact it was, by most measures, growing stronger.'),
      h2('The Radar Chain'),
      p('Britain had built a network of radar stations along its southern and eastern coasts — the Chain Home system. It was not technically sophisticated by later standards. Its operators worked in conditions of considerable discomfort and under persistent attack. It was, however, integrated with Fighter Command\'s control system in a way that allowed scrambled interceptors to be positioned with considerable precision.'),
      p('The Luftwaffe knew, or suspected, that something like this existed. They bombed the radar towers when they could. They discovered that the towers were difficult to destroy and that the system continued to function even with some stations offline. After a few weeks, they stopped prioritizing the radar stations and turned to other targets.'),
      p('This was a significant error. The radar system was the nervous system of the British defense. Attacking it with sustained effort might have degraded it below functional threshold. They did not sustain the effort.'),
      bq('"Never in the field of human conflict was so much owed by so many to so few." — Winston Churchill, August 20, 1940, in a speech delivered while the battle was still ongoing and the outcome uncertain'),
      h2('The Critical Mistake'),
      p('On August 24, a German bomber accidentally dropped bombs on London — probably a navigation error, given that the intended target was oil tanks on the Thames Estuary. Churchill ordered a retaliatory strike on Berlin. The Berlin raid caused minimal damage but considerable shock to a German public that had been assured the Luftwaffe\'s air defenses were impenetrable.'),
      p('Hitler, partly in rage and partly on Göring\'s advice that attacking London would force the RAF into a decisive battle, ordered the Luftwaffe to shift its primary targeting from RAF airfields to London. The first mass bombing of London, the beginning of the Blitz, began on September 7.'),
      p('Fighter Command\'s airfields had been under severe pressure. Several forward bases were badly damaged. The shift to London gave the RAF two weeks during which its infrastructure could be repaired and its pilot roster rebuilt. It was, from the perspective of winning the Battle of Britain, the worst decision Göring could have made.'),
      h2('September 15'),
      p('On September 15 — now commemorated as Battle of Britain Day — the Luftwaffe launched its largest raid of the campaign. Fighter Command, which German intelligence had assessed as nearly finished, scrambled every available aircraft.'),
      p('The Germans lost 60 aircraft. The RAF lost 26. The numbers were not in themselves decisive, but their meaning was: after ten weeks of intensive operations, Fighter Command was still capable of sustained response. The premise of Göring\'s strategy — attrite the RAF to the point of collapse — had failed.'),
      p('On September 17, Hitler indefinitely postponed Operation Sea Lion.'),
      p('The 2,945 aircrew who qualified as Battle of Britain pilots included men from Britain, Poland, Czechoslovakia, Canada, New Zealand, Australia, South Africa, Ireland, Belgium, France, and a handful of Americans flying under false nationalities. Of these, 544 died in the battle. The Luftwaffe lost over 1,700 aircraft. Britain lost around 1,500.'),
      p('It was a close-run thing. Closer, in some respects, than the narrative of heroic triumph allows. But close losses are still losses. Germany never came back to it.'),
    ]
  },

]

console.log(`\n📰  Publishing Batch 4A — 6 articles\n`)
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
