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

  // ── 31. WARSAW UPRISING — Storyteller ──────────────────────────────────────
  {
    _id: 'article-warsaw-uprising-1944',
    _type: 'article',
    title: 'The Warsaw Uprising: Sixty-Three Days Against Everything',
    slug: { _type: 'slug', current: 'article-warsaw-uprising-1944' },
    publishedAt: '2026-04-22T09:00:00Z',
    excerpt: 'On August 1, 1944, the Polish Home Army rose against German occupation. The Red Army was forty kilometres away. It did not advance. For sixty-three days, Warsaw burned while Soviet forces watched from the east bank of the Vistula.',
    body: [
      h2('W-Hour'),
      p('They came out of cellars and attic rooms and the back passages of buildings they had occupied for five years, the fighters of the Armia Krajowa, the Home Army of occupied Poland. On August 1, 1944, at precisely 5 PM — W-Hour, they called it, W for Wybuch, explosion — they took back their city.'),
      p('In the first hours it seemed, almost impossibly, like it might work. Home Army units seized the Old Town, broad sections of the city center, the suburb of Zoliborz. Polish flags went up over buildings that had flown German ones for five years. People ran out of the buildings they had been hiding in and wept in the streets. After five years of the Ghetto, of mass executions in the park at Palmiry, of the cattle cars and the silence that followed them, the white-and-red flag was flying over Warsaw again.'),
      p('The Red Army was forty kilometres away, on the east bank of the Vistula. They could hear the firing.'),
      h2('What Bor Had'),
      p('Commander Tadeusz Bor-Komorowski had planned the uprising for months, watching the front move west through the summer of 1944. Operation Bagration had torn Army Group Centre apart. German forces were in visible disarray. The moment, if it was ever going to come, was now.'),
      p('He had perhaps 40,000 fighters for a city of one million people. Many of them had weapons. Not enough of them had weapons. Some carried pistols. Some carried homemade grenades, Filipinka, made in workshops the Germans didn\'t know existed. A few units had proper rifles. The plan assumed Soviet forces would arrive within days, maybe a week. The uprising was supposed to be the finishing blow, not a standalone siege.'),
      p('It became a standalone siege.'),
      h2('Bach-Zelewski'),
      p('SS-Obergruppenfuhrer Erich von dem Bach was given command of the German response. He had extensive experience. He had commanded anti-partisan operations in the Soviet Union. He knew how to do this.'),
      p('The forces he assembled included regular SS, Wehrmacht units, and the Dirlewanger Brigade — a formation staffed with convicted criminals and concentration camp inmates, commanded by a man later convicted of war crimes, considered by the regular SS too brutal for standard operations. This gives some indication of what "too brutal" meant in that context, and what was now aimed at Warsaw.'),
      p('In the first three days, before any organized military response had fully consolidated, German forces killed approximately 40,000 civilians in the Wola district alone. Men, women, children, patients in hospitals. The intent was to break the will of the population through mass murder. It did not break the will of the Home Army fighters.'),
      h2('The Soviets'),
      p('Stalin called the uprising a reckless adventure launched by criminals. The Soviet Foreign Ministry refused to allow British and American aircraft, flying from Italy to resupply the fighters, to land at Soviet airfields after their missions. Without the ability to land, the aircraft had to fly the round trip from Italy, limiting their load and their range.'),
      p('Soviet radio broadcasts, until August 1, had been calling on Warsaw to rise. After August 1, the broadcasts characterized the uprising as a provocation and the Home Army as fascist collaborators.'),
      p('The reasons were political. Stalin was planning the postwar settlement of Poland. The Home Army was loyal to the Polish government-in-exile in London. A successful Home Army uprising, liberating Warsaw before Soviet forces arrived, would complicate Stalin\'s ability to install a communist government. A destroyed Home Army would not.'),
      bq('"The Warsaw uprising was a terrible tragedy, for which the Fascist invaders of Poland bear full responsibility." — Soviet communique, September 1944, after weeks of refusing to resupply the fighters from Soviet airfields'),
      h2('The Sewers'),
      p('The Old Town fell in early September, after five weeks of house-to-house fighting. The survivors — fighters and civilians together — moved through the sewers, in darkness, for hours, to reach the city center. The passages were barely wide enough to move through. German forces dropped grenades into the sewer openings. People drowned in the effluent. They kept moving.'),
      p('The city center held. It held for sixty-three days total, while the population starved and the buildings burned one by one and the supply drops fell more and more often outside the perimeter.'),
      h2('The Surrender'),
      p('Bor-Komorowski surrendered on October 2, 1944. The terms guaranteed that Home Army fighters would be treated as prisoners of war under the Geneva Convention. The Germans honored this — the fighters were sent to POW camps and most survived. The civilians were expelled from the city.'),
      p('Hitler then ordered Wehrmacht demolition units to systematically destroy what remained of Warsaw, building by building, block by block. They worked methodically through the winter. By January 1945, when Soviet forces finally crossed the Vistula, 85 percent of the city was rubble.'),
      p('The Soviets entered and called it liberation.'),
      p('The Home Army fighters who returned from POW camps were arrested by the new Polish security services. Many were tried and imprisoned. Several were executed. The Armia Krajowa was designated a criminal organization by the communist government that now ran Poland.'),
      p('There is a Warsaw Uprising Museum in the city now. It opened in 2004, sixty years after W-Hour. It is one of the finest museums in Europe. The city that was meant to be erased chose not to stay erased.'),
    ]
  },

  // ── 32. BATTLE OF TRAFALGAR — Quiet Archivist ──────────────────────────────
  {
    _id: 'article-battle-of-trafalgar',
    _type: 'article',
    title: 'Trafalgar: How Britain Secured the Seas for a Century',
    slug: { _type: 'slug', current: 'article-battle-of-trafalgar' },
    publishedAt: '2026-04-22T09:01:00Z',
    excerpt: 'On October 21, 1805, Nelson\'s fleet destroyed the Franco-Spanish line off Cape Trafalgar. Not a single British ship was lost. 22 of 33 enemy vessels were captured or sunk. Nelson died at 4:30 PM. He had already won.',
    body: [
      h2('The Signal'),
      p('The signal Nelson hoisted before the battle began — "England expects that every man will do his duty" — was not, according to the officer who transmitted it, Nelson\'s original intention. Nelson had wanted "England confides," using "confides" in its older sense of trusts. Signal Lieutenant John Pasco noted that "confides" would have to be spelled out flag by flag because it was not in the signal code book, while "expects" was a single hoist. Nelson agreed to the substitution without apparent irritation.'),
      p('This small exchange is worth noting as an illustration of command culture. Nelson was willing to be corrected on practical details by a subordinate lieutenant in the hours before his most significant battle. It also meant that the most famous signal in Royal Navy history exists in its current form because of a code book limitation.'),
      h2('The Forces'),
      p('The British fleet on October 21, 1805, numbered 27 ships of the line. The combined Franco-Spanish fleet under Admiral Pierre-Charles Villeneuve numbered 33. The French flagship Bucentaure was a formidable vessel, and the Spanish Santisima Trinidad, with four decks and 140 guns, was the largest warship in the world.'),
      p('What the Franco-Spanish fleet did not have, and what the British had in quantities their opponents could not match, was gunnery training. Royal Navy crews were drilled at the great guns continuously. Their rate of fire consistently ran three to four times that of equivalent French and Spanish crews. The disparity was institutional, not national — the British Admiralty allocated powder and shot for training exercises in a way that French and Spanish naval establishments did not.'),
      p('The difference in rate of fire was the central tactical fact of the battle.'),
      h2('The Plan'),
      p('Nelson\'s tactical approach, which he had discussed with his captains in such detail that he referred to them as his "band of brothers," was heterodox. Rather than forming a conventional line of battle parallel to the enemy, he planned to attack in two columns perpendicular to the Franco-Spanish line, cutting through it at two points and creating a close-quarters melee.'),
      p('The risk was that the lead ships of each column, approaching bow-on, would be unable to bring their guns to bear during the approach while being raked by the enemy. The head of each column would take significant fire before making contact. Nelson calculated, correctly, that the gunnery of French and Spanish crews would not inflict sufficient damage during this approach to prevent the breakthrough.'),
      p('He placed himself in the lead ship of the northern column, HMS Victory.'),
      h2('The Attack'),
      p('Victory approached the Franco-Spanish line under sustained fire for approximately forty minutes, unable to reply. She took hits to her rigging, her hull, and her crew. Then she broke through the line between the Bucentaure and the Redoutable and within moments was in close action with both.'),
      p('The fighting at close range was savage. Victory and Redoutable were locked together, their sides touching at points. A French sharpshooter in the Redoutable\'s mizzen-top, firing from approximately fifteen metres away, shot Nelson through the left epaulette. The ball passed through his left lung and lodged in his spine.'),
      p('He was carried below. He knew immediately that the wound was mortal.'),
      bq('"Thank God I have done my duty." — Nelson, repeated several times in the hours before his death at 4:30 PM on October 21, 1805'),
      h2('The Result'),
      p('Nelson died at 4:30 PM. By that time the battle was decided. Cuthbert Collingwood, commanding the southern column, had broken the Franco-Spanish rear and the action had become the melee Nelson intended.'),
      p('Of the 33 Franco-Spanish ships, 22 were captured or sunk over the course of the battle and the storm that followed. The British lost no ships. British casualties numbered approximately 1,700 killed and wounded. French and Spanish casualties are less precisely documented but were substantially higher.'),
      p('Villeneuve was captured. He was repatriated to France in 1806 and died shortly afterward under circumstances that may have been suicide; the French inquiry returned an open verdict.'),
      p('Nelson\'s body was transported to England preserved in a cask of spirits of wine — brandy in some accounts, Canary wine with added brandy in others. He was buried in St. Paul\'s Cathedral on January 9, 1806.'),
      p('The strategic consequence of Trafalgar was British naval supremacy for the remainder of the Napoleonic Wars and, in practice, for the remainder of the nineteenth century and beyond. Napoleon never again seriously contemplated an invasion of Britain. The Royal Navy\'s ability to blockade European ports, to supply the Peninsular campaign, and to project power globally was secured by what happened off Cape Trafalgar in the autumn of 1805.'),
      p('HMS Victory remains in dry dock at Portsmouth, listed as still in commission in the Royal Navy — technically the oldest vessel on the active service list. She has not been to sea since 1812.'),
    ]
  },

  // ── 33. OPERATION ENTEBBE — Careful Scholar ────────────────────────────────
  {
    _id: 'article-operation-entebbe',
    _type: 'article',
    title: 'Operation Entebbe: Intelligence, Rehearsal, and Fifty-Three Minutes',
    slug: { _type: 'slug', current: 'article-operation-entebbe' },
    publishedAt: '2026-04-22T09:02:00Z',
    excerpt: 'On July 4, 1976, Israeli commandos landed at Entebbe airport in Uganda, 4,000 kilometres from Israel, and rescued 102 hostages in 53 minutes. The operation has been studied at military academies worldwide for fifty years. What it actually required was extraordinary luck.',
    body: [
      h2('The Hijacking'),
      p('Air France Flight 139 was hijacked on June 27, 1976, shortly after takeoff from Athens, by four terrorists — two members of the German Revolutionary Cells and two of the Popular Front for the Liberation of Palestine-External Operations. The aircraft was diverted to Benghazi for refueling and then to Entebbe, Uganda, where President Idi Amin received the hijackers with demonstrated warmth and provided Ugandan military support for the operation.'),
      p('At Entebbe, the hijackers were joined by additional PFLP-EO members. The total terrorist force guarding the hostages numbered approximately ten. Ugandan soldiers provided perimeter security.'),
      p('On June 29, the hijackers separated the 106 Jewish and Israeli passengers from the remainder of the 256 hostages and released the non-Jewish passengers in Paris. This separation — so clearly reminiscent of selection procedures at Nazi concentration camps — galvanized Israeli public opinion and government action. The remaining 102 hostages included 12 Air France crew members who had refused to leave voluntarily.'),
      h2('The Intelligence'),
      p('The Israeli rescue operation, code-named Operation Thunderball and later known popularly as Operation Entebbe, depended on an unusually complete intelligence picture assembled in under a week.'),
      p('Sources included: Israeli construction firms that had built portions of the Entebbe airport and retained architectural drawings; Mossad contacts who provided information about the terminal layout; the exhaustive debriefings of released hostages who were interviewed immediately upon their arrival in Paris; satellite imagery; and signals intelligence. Within days of the hijacking, IDF planners had a detailed understanding of where the hostages were held, where the terrorists were positioned, and the size and deployment of Ugandan military forces at the airport.'),
      p('A scale model of the old terminal was constructed at an Israeli air base for rehearsal purposes. The assault force practised the operation repeatedly in the days before the mission.'),
      h2('The Force and the Plan'),
      p('The assault force numbered approximately 100 commandos and was commanded by Lieutenant Colonel Yonatan Netanyahu. They flew to Uganda in four C-130 Hercules transport aircraft, accompanied by Boeing 707s configured as command post and airborne hospital, a total flight time of approximately seven hours at low altitude to evade radar.'),
      p('The deception plan included a black Mercedes limousine similar to Idi Amin\'s personal vehicle, followed by two Land Rovers, driving directly to the terminal. The intent was to cause guards to hesitate, uncertain whether the approaching vehicles might be Amin himself. The ruse was expected to work for perhaps thirty seconds. It worked long enough.'),
      p('The assault plan called for neutralizing the terrorists in the first two minutes of contact. Analysis of the rehearsals had established that the critical window was the period before the terrorists could harm the hostages.'),
      h2('The Execution'),
      p('The aircraft landed at 11 PM local time on July 3, 1976. The Mercedes and Land Rovers drove to the terminal. A Ugandan sentry who approached the convoy was shot. The assault team entered the terminal.'),
      p('The operation met its objectives in approximately ninety seconds. All seven terrorists in the terminal were killed. Netanyahu was shot and killed by a Ugandan soldier firing from the control tower during the extraction — he was the only Israeli military fatality.'),
      p('Three hostages died: two in the firefight, one — Dora Bloch, 74, who had been taken to Mulago Hospital in Kampala before the raid — who was killed by Ugandan security forces in reprisal the following day. One hostage, Jean-Jacques Mimouni, was killed accidentally by the assault team.'),
      p('The aircraft were airborne by approximately midnight, less than an hour after landing. They flew to Nairobi for refueling — Kenya\'s cooperation was a significant diplomatic achievement arranged in the preceding days — and then to Israel.'),
      bq('"The operation was not a miracle. It was planning, intelligence, and the willingness to act on imperfect information." — Shimon Peres, who as Defense Minister authorized the operation'),
      h2('What the Operation Required'),
      p('The standard lessons drawn from Entebbe — precise intelligence, thorough rehearsal, surprise at the point of decision — are valid. The operation demonstrated that these elements, when present, can make the apparently impossible feasible.'),
      p('What is sometimes underweighted in the analysis is the degree to which the operation also required conditions that could not be engineered. Uganda\'s military failed to mount any organized response during the rescue, despite having substantial forces at the airport. The Mercedes ruse worked longer than it had any right to. The intelligence picture, assembled in days, was accurate in its essentials.'),
      p('Successful operations look more inevitable in retrospect than they were in execution. Entebbe succeeded. The analysis should account for the margin of fortune that separated success from the alternatives, not only because it is intellectually honest, but because operations planned on the assumption of guaranteed success tend to fail in instructive ways.'),
      p('The raid was completed on American Independence Day, 1976 — a coincidence that was not lost on commentators at the time and has been noted in almost every account written since.'),
    ]
  },

  // ── 34. THE ALAMO — Old Sergeant ───────────────────────────────────────────
  {
    _id: 'article-siege-of-the-alamo',
    _type: 'article',
    title: 'The Alamo: Nobody Had to Stay',
    slug: { _type: 'slug', current: 'article-siege-of-the-alamo' },
    publishedAt: '2026-04-22T09:03:00Z',
    excerpt: 'On February 23, 1836, Santa Anna\'s army arrived outside the old mission they called the Alamo. William Barret Travis had couriers going out every day — he could have sent everyone with them. He didn\'t. Thirteen days later, no one was left to send.',
    body: [
      h2('The Arrival'),
      p('February 23, 1836. The Mexican army showed up. There were about 1,500 of them, under General Antonio Lopez de Santa Anna, who had marched north through the Texas winter to make a point about what happens to provinces that try to secede.'),
      p('Inside the Alamo — an old Franciscan mission repurposed as a fort, walls about three feet thick, interior maybe two and a half acres — were somewhere between 182 and 250 defenders, depending on which roster you trust and whether you count the civilians. They\'d had weeks to prepare. They had seventeen cannon. They had food for maybe two weeks. They had no reinforcements coming that anyone could confirm.'),
      p('From the tower of San Fernando church, Santa Anna raised a red flag. No quarter. The defenders understood what that meant.'),
      h2('Why They Stayed'),
      p('This part gets lost sometimes in the mythology. They had a choice. For the first several days of the siege, the Mexican investment wasn\'t complete. Travis was sending couriers out every day with letters begging for reinforcements. Those couriers got through. The men who carried them got through. Travis could have sent everyone out with the couriers.'),
      p('He didn\'t. Nobody left who didn\'t have to.'),
      p('William Barret Travis was twenty-six years old, technically in command, and managing a volunteer force that didn\'t particularly respect his authority. Jim Bowie, who shared command, had typhoid or pneumonia or something similar and was bedridden within the first week; he would never fight again. Davy Crockett had come down from Tennessee after losing his congressional seat, looking for something — glory, land, a change of scene. He got something.'),
      p('The famous letter Travis wrote on February 24 was real. "I shall never surrender or retreat. Victory or Death." It got out. Help didn\'t come. Thirty-two men from Gonzales made it through the Mexican lines on March 1. Nobody else.'),
      bq('"I am besieged by a thousand or more of the Mexicans under Santa Anna. I have sustained a continual Bombardment and cannonade for 24 hours and have not lost a man. The enemy has demanded a surrender at discretion, otherwise, the garrison are to be put to the sword, if the fort is taken. I have answered the demand with a cannon shot, and our flag still waves proudly from the walls. I shall never surrender or retreat." — William Barret Travis, February 24, 1836'),
      h2('Thirteen Days'),
      p('The siege lasted thirteen days. Cannon fire hit the walls daily. The defenders repaired what they could. They slept in shifts. Bowie got worse. Travis kept writing letters. Crockett played the fiddle at night, or so the stories say; the stories about Crockett are always doing things like that.'),
      p('Santa Anna was losing patience. He had a campaign to run, a rebellion to put down, and he wasn\'t going to spend weeks reducing one undermanned fort while the rest of Texas organized.'),
      h2('March 6'),
      p('The final assault started at 5:30 in the morning, March 6, 1836. Four columns of Mexican infantry hit the walls. A military band played "El Deguello" — the throat-cutting — which was the traditional Mexican military signal for no quarter. The defenders knew what it meant.'),
      p('They had about twenty minutes.'),
      p('Mexican forces took casualties going over the walls. The cannon fire from inside the fort tore through the advancing columns. Travis was shot through the head early in the fighting. Bowie was killed in his room, probably in his cot. Crockett died somewhere near the front of the church, or at the palisade, or was captured and executed afterward — the accounts disagree.'),
      p('Everyone died. The number who survived the battle is zero.'),
      h2('What Followed'),
      p('Santa Anna had the bodies burned. Their names have been reconstructed from rosters, muster lists, and testimony — the final count runs between 182 and 257 depending on the source.'),
      p('"Remember the Alamo" became the battle cry of the Texas Revolution. Six weeks later, Sam Houston\'s army caught Santa Anna at San Jacinto, caught him with his pants figuratively and almost literally down during an afternoon siesta, and destroyed his force in eighteen minutes flat. Santa Anna was captured hiding in the grass in a private\'s uniform. He signed documents recognizing Texas independence.'),
      p('The thirteen-day delay at the Alamo had given Houston time to organize a real army. Whether Travis calculated that, whether he knew the delay might matter, is impossible to say. Maybe they all did. Maybe they were just stubborn. Men who write "Victory or Death" and mean it tend not to be operating on a cost-benefit analysis.'),
      p('It comes to the same thing either way. The Alamo held for thirteen days. Texas got its independence. The defenders got a story that has not stopped being told in the 190 years since.'),
    ]
  },

]

console.log(`\n📰  Publishing Batch 4B — 4 articles\n`)
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
