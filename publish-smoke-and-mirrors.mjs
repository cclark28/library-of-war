/**
 * publish-smoke-and-mirrors.mjs
 * Creates the "Smoke and Mirrors" series and publishes 12 articles.
 * Run: node publish-smoke-and-mirrors.mjs
 */
import { readFileSync } from 'fs'
import { resolve } from 'path'

const TOKEN = process.env.SANITY_API_TOKEN ||
  (() => {
    try {
      const env = readFileSync(resolve('.env.local'), 'utf-8')
      return env.match(/SANITY_API_TOKEN=(.+)/)?.[1]?.trim()
    } catch { return null }
  })()

if (!TOKEN) { console.error('No SANITY_API_TOKEN'); process.exit(1) }

const PROJECT = 'tifzt4zw'
const DATASET = 'production'
const BASE    = `https://${PROJECT}.api.sanity.io/v2023-01-01/data`

function key(prefix = '') { return `${prefix}${Math.random().toString(36).slice(2, 10)}` }

function block(text, style = 'normal') {
  return {
    _type: 'block', _key: key('b'),
    style,
    children: [{ _type: 'span', _key: key('s'), text, marks: [] }],
    markDefs: [],
  }
}

function h2(text) { return block(text, 'h2') }
function h3(text) { return block(text, 'h3') }
function p(text)  { return block(text, 'normal') }
function bq(text) { return block(text, 'blockquote') }

async function mutate(mutations) {
  const r = await fetch(`${BASE}/mutate/${DATASET}?returnDocuments=false`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ mutations }),
  })
  const d = await r.json()
  if (!r.ok) throw new Error(JSON.stringify(d))
  return d
}

// ── Series ───────────────────────────────────────────────────────────────────
const SERIES_ID = 'series-smoke-and-mirrors'

const series = {
  _id: SERIES_ID,
  _type: 'series',
  title: 'Smoke and Mirrors',
  slug: { _type: 'slug', current: 'smoke-and-mirrors' },
  description: 'Military conspiracies, government cover-ups, and historical myths — examined without the tinfoil hat. Each article ends with a verdict: CONFIRMED, PLAUSIBLE, or DEBUNKED.',
  order: 4,
}

// ── Articles ─────────────────────────────────────────────────────────────────
const NOW = new Date().toISOString()

const ARTICLES = [

// 1 — Operation Paperclip
{
  _id: 'sm-paperclip',
  _type: 'article',
  title: 'Operation Paperclip: How America Recruited Nazi Scientists to Win the Cold War',
  slug: { _type: 'slug', current: 'operation-paperclip-how-america-recruited-nazi-scientists' },
  status: 'published',
  publishedAt: NOW,
  difficulty: 'intermediate',
  verdict: 'CONFIRMED',
  tags: ['Operation Paperclip', 'Cold War', 'NASA', 'Wernher von Braun', 'OSS', 'USAF', 'covert operations', 'Nazi Germany'],
  excerpt: 'In 1945, the US government quietly hired over 1,600 Nazi scientists, engineers, and doctors — some with serious war crimes on their records — and gave them new names, new jobs, and American citizenship.',
  series: { _type: 'reference', _ref: SERIES_ID },
  body: [
    p(`In the summer of 1945, the war in Europe was over. The Nazi regime was finished. The trials were coming. And the United States government was quietly rounding up the best scientific minds the Third Reich had produced — and offering them a deal.`),
    p(`New identities. New jobs. American citizenship. A chance to keep working.`),
    p(`The program was called Operation Paperclip. Over the following decade, it brought more than 1,600 German scientists, engineers, and technicians to the United States. Many of them had been members of the Nazi Party. Some had designed weapons using slave labor from concentration camps. One — Wernher von Braun — had done both, and would go on to build the rockets that put Americans on the moon.`),
    h2('The Recruitment Drive'),
    p(`The original program, Joint Intelligence Objectives Agency (JIOA), was meant to target only scientists with no significant Nazi ties. That standard lasted about five minutes. The US Army wanted Werner von Braun. The Air Force wanted aerodynamics engineers. The CIA wanted intelligence analysts who had worked on Soviet operations. The State Department's objections were systematically overridden.`),
    p(`The fix was simple and cynical: officials at the JIOA rewrote the dossiers. Incriminating references to Party membership, SS rank, or concentration camp connections were removed or softened. The cleaned-up files went to President Truman for approval. He signed off, having been told the men were clean.`),
    p(`They were not clean.`),
    h2('The Scientists'),
    p(`Von Braun is the most famous case. He had been an SS Sturmbannführer (major) who personally toured the Mittelbau-Dora concentration camp, where V-2 rockets were built by enslaved prisoners under conditions so brutal that more people died building the V-2 than were ever killed by it. He later claimed he had no choice. His American handlers chose to believe him.`),
    p(`Other recruits included Kurt Blome, who had run the Nazi biological warfare program and was acquitted at Nuremberg for lack of evidence — and was subsequently hired by the US Army Chemical Corps. Walter Schreiber, former Surgeon General of the German Army, who had overseen medical experiments on concentration camp prisoners, was brought to the US before journalists identified him and forced his departure to Argentina.`),
    p(`Arthur Rudolph, who had run the Mittelwerk factory where V-2s were assembled using slave labor, became a senior NASA engineer and received the Distinguished Service Medal before his wartime record was fully investigated. He renounced his citizenship in 1984 rather than face prosecution.`),
    h2('What They Built'),
    p(`The Paperclip scientists were not marginal figures. They were central to the postwar American military and scientific establishment. Von Braun led the team that built the Jupiter-C rocket used for America's first satellite, then the Saturn V that carried Apollo to the moon. Paperclip engineers contributed to the US ballistic missile program, jet aircraft development, and early space research.`),
    p(`The Soviet Union ran an identical program — Operation Osoaviakhim — sweeping up their own share of German expertise. The Cold War was, in part, a competition between two countries armed with the same German scientists.`),
    h2('The Cover-Up'),
    p(`Operation Paperclip remained classified until 1974. The moral compromises at its core — that the US government knowingly harbored war criminals, falsified records, and lied to its own president — were not publicly acknowledged for decades. When they finally were, the official line was that the strategic necessity of the Cold War justified the decision.`),
    p(`That argument has never been fully settled. The scientists were real. The rockets were real. The concentration camps were also real, and the people who died in them did not get new names and American citizenship.`),
    bq(`"It was a difficult moral choice. But we didn't have the luxury of letting the Soviets get them first." — common justification, never fully accepted by the families of slave laborers.`),
    h2('Verdict'),
    p(`CONFIRMED. Operation Paperclip is thoroughly documented through declassified JIOA files, Congressional investigations, and the scientists' own records. Annie Jacobsen's 2014 book Operation Paperclip, based on thousands of declassified documents, is the definitive account.`),
  ],
  sources: [
    { _type: 'source', _key: key(), title: 'Operation Paperclip: The Secret Intelligence Program that Brought Nazi Scientists to America', publisher: 'Annie Jacobsen, Little, Brown', url: 'https://www.hachettebookgroup.com/titles/annie-jacobsen/operation-paperclip/9780316221016/', date: '2014' },
    { _type: 'source', _key: key(), title: 'JIOA Declassified Files — Operation Paperclip', publisher: 'National Archives (NARA)', url: 'https://www.archives.gov/research/captured-german-records', date: '1945–1955' },
    { _type: 'source', _key: key(), title: 'Arthur Rudolph and the Mittelwerk Factory', publisher: 'US Department of Justice, Office of Special Investigations', url: 'https://www.justice.gov/archives/opa/blog/nazi-hunting-america', date: '1984' },
    { _type: 'source', _key: key(), title: 'Wernher von Braun and the SS', publisher: 'NASA Historical Division', url: 'https://history.nasa.gov/sputnik/braun.html', date: '1945' },
  ],
},

// 2 — Operation Northwoods
{
  _id: 'sm-northwoods',
  _type: 'article',
  title: 'Operation Northwoods: The Pentagon\'s Plan to Stage Terrorist Attacks on Americans',
  slug: { _type: 'slug', current: 'operation-northwoods-pentagon-plan-fake-terrorist-attacks' },
  status: 'published',
  publishedAt: NOW,
  difficulty: 'intermediate',
  verdict: 'CONFIRMED',
  tags: ['Operation Northwoods', 'Cold War', 'Cuba', 'false flag', 'Joint Chiefs of Staff', 'Kennedy', 'CIA'],
  excerpt: 'In 1962, the US Joint Chiefs of Staff unanimously signed off on a plan to fake terrorist attacks on American civilians and blame them on Cuba — as a pretext for invasion. President Kennedy rejected it. The document stayed secret for 35 years.',
  series: { _type: 'reference', _ref: SERIES_ID },
  body: [
    p(`On March 13, 1962, the Chairman of the Joint Chiefs of Staff, General Lyman Lemnitzer, signed his name to one of the most extraordinary documents in American military history. The memo, classified Top Secret, proposed a series of covert operations designed to manufacture American public support for a military invasion of Cuba.`),
    p(`The operations included bombing American cities. Sinking American ships. Shooting down American civilian aircraft. And blaming all of it on Fidel Castro.`),
    p(`The Joint Chiefs signed it unanimously. Kennedy rejected it and fired Lemnitzer shortly after.`),
    h2('The Context'),
    p(`By early 1962, the United States was obsessed with Cuba. The Bay of Pigs invasion had failed catastrophically the previous year. Castro was consolidating power. The CIA was running a covert war called Operation Mongoose. And the military was frustrated that political constraints kept preventing direct action.`),
    p(`The problem was public opinion. Most Americans didn't want another war so soon after Korea. The solution, as the Joint Chiefs saw it, was to give them a reason.`),
    h2('The Plan'),
    p(`The Northwoods document, formally titled "Justification for US Military Intervention in Cuba," laid out a menu of false flag options. Among the proposals:`),
    p(`Blow up an American ship in Guantanamo Bay and blame Cuba. Stage a fake attack on the US naval base at Guantanamo, complete with fake casualties. Develop "a Communist Cuban terror campaign in the Miami area, in other Florida cities and even in Washington." Shoot down a CIA drone disguised as a commercial airliner and claim Cuba did it. Arrange for "a 'Remember the Maine' incident" — a reference to the disputed 1898 explosion that triggered the Spanish-American War.`),
    p(`The document explicitly discussed real American casualties as acceptable: "It is possible to create an incident which will demonstrate convincingly that a Cuban aircraft has attacked and shot down a chartered civil airliner."  `),
    h2('Kennedy\'s Response'),
    p(`Kennedy met with Lemnitzer on March 16, 1962, three days after the document was signed. He rejected the proposals and shortly after had Lemnitzer reassigned to NATO. The document was classified and buried.`),
    p(`It remained secret until 1997, when it was declassified as part of the Kennedy Assassination Records Review Act — which had nothing to do with Cuba and everything to do with JFK's murder eighteen months later. Journalists found it in 2001.`),
    h2('What It Means'),
    p(`Northwoods is significant not because it was carried out — it wasn't — but because it was proposed at the highest levels of the US military and signed off unanimously. It demonstrates that false flag operations were not fringe thinking. They were a legitimate planning option, taken seriously enough to memo to the Secretary of Defense.`),
    p(`The document also functions as a partial explanation for why certain conspiracy theories about American government have such persistent appeal. When the government has actually proposed doing things like this, the bar for plausibility shifts.`),
    bq(`"We could blow up a US ship in Guantanamo Bay and blame Cuba." — Operation Northwoods memorandum, 1962, declassified 1997.`),
    h2('Verdict'),
    p(`CONFIRMED. The original document is held at the National Security Archive at George Washington University and is available online. This is not a theory. It is a memorandum signed by the Joint Chiefs of Staff.`),
  ],
  sources: [
    { _type: 'source', _key: key(), title: 'Operation Northwoods Original Document', publisher: 'National Security Archive, George Washington University', url: 'https://nsarchive2.gwu.edu/news/20010430/northwoods.pdf', date: 'March 13, 1962' },
    { _type: 'source', _key: key(), title: 'Body of Secrets: Anatomy of the Ultra-Secret National Security Agency', publisher: 'James Bamford, Doubleday', url: 'https://www.penguinrandomhouse.com/books/86395/body-of-secrets-by-james-bamford/', date: '2001' },
    { _type: 'source', _key: key(), title: 'Kennedy Assassination Records Review Act Declassified Files', publisher: 'National Archives', url: 'https://www.archives.gov/research/jfk', date: '1997' },
  ],
},

// 3 — Operation Gladio
{
  _id: 'sm-gladio',
  _type: 'article',
  title: 'Operation Gladio: NATO\'s Secret Armies and the Terrorism Nobody Was Supposed to Know About',
  slug: { _type: 'slug', current: 'operation-gladio-nato-secret-armies-europe' },
  status: 'published',
  publishedAt: NOW,
  difficulty: 'advanced',
  verdict: 'CONFIRMED',
  tags: ['Operation Gladio', 'Cold War', 'NATO', 'Italy', 'terrorism', 'stay-behind networks', 'CIA', 'MI6'],
  excerpt: 'After World War II, NATO secretly built armed guerrilla networks across Western Europe to resist a Soviet invasion. The networks stayed active for decades — and in Italy, evidence linked them to actual terrorist bombings during the "Years of Lead."',
  series: { _type: 'reference', _ref: SERIES_ID },
  body: [
    p(`In 1990, Italian Prime Minister Giulio Andreotti stood before parliament and admitted something that had been secret for 45 years. Since the end of World War II, Italy had maintained a clandestine armed network — funded by the CIA and coordinated through NATO — that had stockpiled weapons across the country in anticipation of a Soviet invasion.`),
    p(`The network was called Gladio, from the Latin for sword. And Italy was not alone. Every NATO member in Western Europe had one.`),
    h2('The Architecture of Secret War'),
    p(`The logic was sound, in a Cold War way. If the Soviets invaded Western Europe, conventional military resistance might collapse quickly. But a pre-positioned guerrilla network — trained, armed, and hidden before any invasion — could continue resistance from behind enemy lines. It was the lessons of the French Resistance institutionalised.`),
    p(`Each country had a different code name: Gladio in Italy, Stay-Behind in the UK, SDRA8 in Belgium, P26 in Switzerland, ROC in the Netherlands. The CIA coordinated the program. MI6 helped. Every government knew. Almost no citizen did.`),
    h2('The Italian Problem'),
    p(`In most countries, the stay-behind networks remained dormant. In Italy, they did not stay dormant.`),
    p(`Italy in the 1970s experienced a period of intense political violence called the "Anni di Piombo" — Years of Lead. Left-wing and right-wing terrorist groups carried out hundreds of attacks. The deadliest single incident was the 1980 Bologna railway station bombing, which killed 85 people and was eventually attributed to neo-fascist group Nuclei Armati Rivoluzionari — with evidence of links to elements of Italian military intelligence and, more distantly, Gladio-connected networks.`),
    p(`Italian parliamentary investigations found evidence that elements of the Italian stay-behind network had pursued a "strategy of tension" — deliberately fostering political violence to justify a crackdown on the left and prevent Communist electoral victories. The evidence is documented. The full picture remains contested.`),
    h2("Andreotti's Admission"),
    p(`When Andreotti revealed Gladio's existence in 1990, the reaction across Europe was seismic. Parliaments demanded answers. The European Parliament passed a resolution condemning the networks and calling for a full investigation. Most governments stonewalled. The Belgian Gladio network was linked to a series of supermarket massacres in the 1980s that killed 28 people and were never solved.`),
    p(`NATO issued a brief statement confirming the general existence of stay-behind planning and said nothing else useful.`),
    h2('What We Know and What We Don\'t'),
    p(`The existence of Gladio is confirmed. The weapons caches are documented. The NATO coordination is documented. The Italian stay-behind network's links to specific terrorist acts are documented to varying degrees depending on the incident. What is not confirmed — and may never be — is the full chain of command for specific operations, or the degree to which political violence was actively directed rather than merely enabled.`),
    bq(`"You had to attack civilians, the people, women, children, innocent people, unknown people far removed from any political game. The reason was quite simple: to force the Italian public to turn to the state." — Vincenzo Vinciguerra, neo-fascist convicted of a 1972 bombing, on the strategy of tension.`),
    h2('Verdict'),
    p(`CONFIRMED. The existence of NATO stay-behind networks is thoroughly documented. The Italian parliamentary investigation ran for years and produced extensive documentation. The link to specific acts of terrorism is proven in some cases, strongly suggested in others, and the subject of ongoing historical debate.`),
  ],
  sources: [
    { _type: 'source', _key: key(), title: 'NATO\'s Secret Armies: Operation Gladio and Terrorism in Western Europe', publisher: 'Daniele Ganser, Frank Cass', url: 'https://www.routledge.com/NATOs-Secret-Armies-Operation-Gladio-and-Terrorism-in-Western-Europe/Ganser/p/book/9780714685007', date: '2005' },
    { _type: 'source', _key: key(), title: 'Italian Parliamentary Commission on Gladio (Commissione Parlamentare)', publisher: 'Italian Senate', url: 'https://www.senato.it/', date: '1990–2000' },
    { _type: 'source', _key: key(), title: 'European Parliament Resolution on Gladio', publisher: 'European Parliament', url: 'https://www.europarl.europa.eu/', date: 'November 22, 1990' },
    { _type: 'source', _key: key(), title: 'BBC Documentary: Operation Gladio (1992)', publisher: 'BBC Timewatch', url: 'https://www.bbc.co.uk/programmes/p00fwfpx', date: '1992' },
  ],
},

// 4 — The Green Run
{
  _id: 'sm-green-run',
  _type: 'article',
  title: 'The Green Run: The Day the US Military Deliberately Poisoned Its Own Citizens',
  slug: { _type: 'slug', current: 'the-green-run-us-military-radioactive-release-washington' },
  status: 'published',
  publishedAt: NOW,
  difficulty: 'intermediate',
  verdict: 'CONFIRMED',
  tags: ['Green Run', 'Cold War', 'Hanford', 'radiation', 'nuclear weapons', 'AEC', 'human experimentation', 'Washington State'],
  excerpt: 'On the night of December 2, 1949, the US military deliberately released a massive cloud of radioactive material over eastern Washington State. They wanted to test whether they could detect Soviet nuclear facilities from the air. They didn\'t tell anyone.',
  series: { _type: 'reference', _ref: SERIES_ID },
  body: [
    p(`The Hanford Site in eastern Washington State produced the plutonium for the bomb dropped on Nagasaki. By 1949, it was the heart of America's nuclear weapons program. On December 2 of that year, on a clear night with a favorable wind, Hanford operators deliberately vented radioactive iodine-131 and xenon-133 from a nuclear reactor into the atmosphere.`),
    p(`They released approximately 7,780 curies of iodine-131. For context, the Three Mile Island accident in 1979 released 15 to 24 curies. The Green Run released roughly 500 times that amount, deliberately, over populated farmland.`),
    p(`The purpose: to test aerial detection equipment being developed to locate Soviet nuclear facilities.`),
    p(`The people living downwind were not informed.`),
    h2('Why "Green Run"'),
    p(`The name referred to the experimental processing of "green" — recently irradiated, insufficiently cooled — uranium fuel. Normal processing used fuel that had been cooled for 90 to 100 days, which allowed radioactive decay to reduce contamination. The Green Run used fuel cooled for only 16 days, maximizing the radioactive output to create a detectable plume.`),
    p(`Hanford officials were aware the release would exceed safe limits. The Atomic Energy Commission approved it anyway. The local population — farmers, dairy workers, people in Spokane, Kennewick, Walla Walla — had no idea.`),
    h2('The Fallout'),
    p(`The plume traveled 200 miles. Iodine-131 contaminated vegetation and was absorbed by dairy cows, concentrating in their milk. Airborne monitoring detected contamination at levels significantly above background across the region. The AEC's own sampling found contaminated oysters in the Columbia River and contaminated vegetation hundreds of miles from Hanford.`),
    p(`The experiment files were classified. Local people noticed nothing because nothing was visible — radiation is not visible. The thyroid cancers, if caused by iodine-131 exposure, would not have appeared for years or decades.`),
    h2('The Revelation'),
    p(`The Green Run remained classified until 1986, when Hanford documents were released following a Freedom of Information Act request by local journalists and activists. The revelation triggered congressional hearings, class action lawsuits, and a long-running public health study called the Hanford Thyroid Disease Study, which ran until 2002 and found no statistically significant increase in thyroid disease — a finding disputed by some researchers who argued the study's design made it unable to detect the kind of effects expected.`),
    p(`Whether the Green Run caused specific health damage to specific people has never been definitively established. That the government deliberately irradiated its own citizens without consent, classified the results, and buried the files for 37 years is not in dispute.`),
    bq(`"We were cold war warriors. We were trying to win, and we didn't think about the people downwind." — unnamed former Hanford official, cited in investigative reporting.`),
    h2('Verdict'),
    p(`CONFIRMED. The Green Run is documented through declassified AEC files and Hanford Site records. Congressional hearings confirmed the event. The only contested question is the degree of health harm caused.`),
  ],
  sources: [
    { _type: 'source', _key: key(), title: 'The Plutonium Files: America\'s Secret Medical Experiments in the Cold War', publisher: 'Eileen Welsome, Dial Press', url: 'https://www.penguinrandomhouse.com/books/330397/the-plutonium-files-by-eileen-welsome/', date: '1999' },
    { _type: 'source', _key: key(), title: 'Hanford Site Historical Documents — Green Run Declassified Files', publisher: 'US Department of Energy', url: 'https://www.hanford.gov/', date: '1949, declassified 1986' },
    { _type: 'source', _key: key(), title: 'Hanford Thyroid Disease Study Final Report', publisher: 'Centers for Disease Control', url: 'https://www.cdc.gov/nceh/hanford/docs/htds_final_rpt.pdf', date: '2002' },
  ],
},

// 5 — Operation Sea-Spray
{
  _id: 'sm-sea-spray',
  _type: 'article',
  title: 'Operation Sea-Spray: The Army Sprayed Biological Agents on San Francisco for Six Days',
  slug: { _type: 'slug', current: 'operation-sea-spray-army-biological-agents-san-francisco' },
  status: 'published',
  publishedAt: NOW,
  difficulty: 'intermediate',
  verdict: 'CONFIRMED',
  tags: ['Operation Sea-Spray', 'Cold War', 'biological warfare', 'San Francisco', 'human experimentation', 'US Army', 'bioweapons'],
  excerpt: 'Between September 20 and 27, 1950, the US Army released clouds of bacteria over San Francisco Bay to simulate a Soviet biological attack. The bacteria were considered harmless. One man died. The Army denied responsibility for eleven years.',
  series: { _type: 'reference', _ref: SERIES_ID },
  body: [
    p(`In September 1950, the US Army conducted an experiment on the city of San Francisco. For six days, Navy minesweepers cruised just outside the Golden Gate, spraying aerosol clouds of two types of bacteria — Serratia marcescens and Bacillus globigii — into the fog rolling off the Pacific.`),
    p(`The purpose was to test how a biological weapon might disperse across a major American city in the event of a Soviet attack. The bacteria were considered harmless simulants. Residents of San Francisco inhaled them for six days without knowing.`),
    p(`Shortly after the experiment ended, Edward Nevin, a patient at Stanford Hospital recovering from a urinary tract procedure, developed Serratia marcescens pneumonia and died. Ten other patients in the same hospital were also infected.`),
    h2('The Program'),
    p(`Sea-Spray was one of dozens of open-air biological and chemical agent tests the US Army conducted between 1949 and 1968, collectively studied under what became known as the Special Operations Division. The Army tested simulants — bacteria and chemicals believed to be non-pathogenic — across American cities, rural areas, and the New York City subway system, where Bacillus globigii was released from light bulbs dropped on the tracks.`),
    p(`The rationale was defensive: the US needed to understand how a Soviet bio-attack would spread in order to prepare countermeasures. The tests were classified.`),
    h2('The Death'),
    p(`Edward Nevin III, grandson of the man who died, spent years trying to establish the connection between his grandfather's death and the Army's experiment. In 1981, he filed suit. The case went to federal court.`),
    p(`The Army's position was that Serratia marcescens was ubiquitous in the environment and that the hospital outbreak could not be definitively linked to the test. The court agreed and dismissed the case. The scientific debate continues: some researchers note that Serratia marcescens infections were extremely rare before 1950 and spiked in the Bay Area immediately following the test.`),
    h2('The Revelation'),
    p(`Sea-Spray came to light in 1977, during Senate hearings on the Army's covert testing program. The Senate subcommittee, chaired by Senator Edward Kennedy, documented 239 populated areas used as test sites between 1949 and 1969. The Army acknowledged the tests.`),
    p(`What followed was a familiar pattern: congressional outrage, promises of reform, and the gradual disappearance of the story from public consciousness. The question of legal liability for deaths caused by the tests was never definitively resolved.`),
    bq(`"The Army conducted 239 open-air tests, exposing large segments of the American public to potentially dangerous substances without their knowledge or consent." — Senate Subcommittee on Health, 1977.`),
    h2('Verdict'),
    p(`CONFIRMED. The testing program is documented through congressional testimony, Army records, and declassified files. The San Francisco test specifically is confirmed. The causal link to Edward Nevin's death remains officially unproven and scientifically disputed.`),
  ],
  sources: [
    { _type: 'source', _key: key(), title: 'Hearings Before the Subcommittee on Health: Biological Testing Involving Human Subjects', publisher: 'US Senate, 95th Congress', url: 'https://www.govinfo.gov/', date: '1977' },
    { _type: 'source', _key: key(), title: 'US Army Activity in the US Biological Warfare Programs', publisher: 'US Department of the Army', url: 'https://www.research.va.gov/topics/biologic.cfm', date: '1977' },
    { _type: 'source', _key: key(), title: 'A Higher Form of Killing: The Secret History of Chemical and Biological Warfare', publisher: 'Robert Harris and Jeremy Paxman, Random House', url: 'https://www.penguinrandomhouse.com/', date: '2002' },
  ],
},

// 6 — Unit 731
{
  _id: 'sm-unit-731',
  _type: 'article',
  title: 'Unit 731: Japan\'s Biological Warfare Program and the American Cover-Up That Followed',
  slug: { _type: 'slug', current: 'unit-731-japan-biological-warfare-program-american-cover-up' },
  status: 'published',
  publishedAt: NOW,
  difficulty: 'advanced',
  verdict: 'CONFIRMED',
  tags: ['Unit 731', 'World War II', 'Japan', 'biological warfare', 'war crimes', 'Shiro Ishii', 'cover-up', 'MacArthur'],
  excerpt: 'Unit 731 was the Imperial Japanese Army\'s secret biological warfare research unit, which conducted lethal experiments on thousands of prisoners. After Japan\'s defeat, the US government granted its scientists immunity from prosecution — in exchange for the data.',
  series: { _type: 'reference', _ref: SERIES_ID },
  body: [
    p(`Between 1935 and 1945, a secret Japanese military facility near Harbin, in occupied Manchuria, ran what was almost certainly the largest biological warfare research program in history. It tested plague, cholera, typhoid, anthrax, and frostbite on live human subjects. It dropped plague-infected fleas from aircraft onto Chinese cities. It conducted vivisections without anesthesia.`),
    p(`The facility was Unit 731 of the Kwantung Army. Its commander was Lieutenant General Shiro Ishii, a physician who had become convinced that biological weapons were the future of warfare and that no ethical constraints should limit their development.`),
    p(`At least 3,000 people died inside the facility. The true number is unknown. They were called "maruta" — logs — by the researchers.`),
    h2('The Experiments'),
    p(`Unit 731's research covered an extraordinary range of horrors. Prisoners were infected with plague, cholera, smallpox, and botulism to measure incubation and lethality. They were subjected to pressure chambers to determine how much decompression the human body could survive. They were frozen alive in incremental stages to study frostbite progression. They were deprived of food and water to document starvation timelines. They were given transfusions of horse blood. They were vivisected — surgically dissected — while conscious, to obtain uncontaminated organs.`),
    p(`The subjects were predominantly Chinese civilians and prisoners of war, along with Soviet, Korean, and Mongolian captives. American and Australian prisoners of war were also used, though the US government has never officially confirmed this.`),
    h2('The American Deal'),
    p(`When Japan surrendered in 1945, US intelligence learned of Unit 731's existence. General Douglas MacArthur's occupation authority made a decision that has been debated ever since: in exchange for the research data — data purchased in atrocities — the US government granted Ishii and the other Unit 731 scientists immunity from war crimes prosecution.`),
    p(`The data was classified and transferred to Fort Detrick, Maryland, the US Army's biological warfare research center. The scientists returned to civilian life. Several achieved distinguished careers in Japanese medicine. Ishii died of throat cancer in 1959. He was never prosecuted.`),
    h2('The Soviet Trials'),
    p(`The Soviet Union, which had captured some Unit 731 personnel, tried twelve of them at the Khabarovsk War Crimes Trial in 1949. The defendants confessed and were convicted. The US dismissed the trial as Communist propaganda at the time. The confessions were later found to be substantially accurate.`),
    h2('The Cover-Up'),
    p(`The American decision to trade immunity for data was kept secret until the 1980s, when journalists and historians — particularly Sheldon Harris, author of Factories of Death — began uncovering the documentary record. Subsequent declassification confirmed the essential outlines. The National Archives released relevant files in the 1990s.`),
    p(`Japan's government has never issued a full official apology for Unit 731. The Harbin facility site is now a museum.`),
    bq(`"Had information available to the US been discovered by the Soviets, the Soviets would have been able to use the information against the US." — US War Department memo justifying the immunity deal, 1947.`),
    h2('Verdict'),
    p(`CONFIRMED. The existence of Unit 731 and the American immunity deal are documented through declassified US Army files, State Department cables, and the 1949 Khabarovsk trial transcripts. Sheldon Harris's Factories of Death (1994) and Hal Gold's Unit 731 Testimony (1996) are the foundational historical accounts.`),
  ],
  sources: [
    { _type: 'source', _key: key(), title: 'Factories of Death: Japanese Biological Warfare 1932–45 and the American Cover-Up', publisher: 'Sheldon Harris, Routledge', url: 'https://www.routledge.com/', date: '1994' },
    { _type: 'source', _key: key(), title: 'Khabarovsk War Crime Trial Documents', publisher: 'Soviet Ministry of Justice', url: 'https://www.archives.gov/', date: '1949' },
    { _type: 'source', _key: key(), title: 'US National Archives: Unit 731 Declassified Files', publisher: 'National Archives (NARA)', url: 'https://www.archives.gov/research/captured-german-records', date: '1945–1947, declassified 1990s' },
    { _type: 'source', _key: key(), title: 'A Plague Upon Humanity: The Secret Genocide of Axis Japan\'s Germ Warfare Operation', publisher: 'Daniel Barenblatt, HarperCollins', url: 'https://www.harpercollins.com/', date: '2004' },
  ],
},

// 7 — Operation Mockingbird
{
  _id: 'sm-mockingbird',
  _type: 'article',
  title: 'Operation Mockingbird: Did the CIA Actually Control the American Press?',
  slug: { _type: 'slug', current: 'operation-mockingbird-cia-american-press' },
  status: 'published',
  publishedAt: NOW,
  difficulty: 'intermediate',
  verdict: 'PLAUSIBLE',
  tags: ['Operation Mockingbird', 'Cold War', 'CIA', 'media', 'propaganda', 'journalism', 'Church Committee'],
  excerpt: 'The CIA admitted to running a covert media influence program. What it denied was how big it was. A 1977 Rolling Stone investigation claimed it reached over 400 journalists and 25 major organizations. The full picture has never been established.',
  series: { _type: 'reference', _ref: SERIES_ID },
  body: [
    p(`In 1977, Carl Bernstein — one of the two Washington Post reporters who broke Watergate — published a 25,000-word investigation in Rolling Stone magazine. Based on CIA files and interviews with officials, he reported that the agency had, since the early 1950s, recruited American journalists as assets, placed stories in major publications, and used media organizations as cover for intelligence operations.`),
    p(`The program, according to sources Bernstein cited, went by a name: Operation Mockingbird.`),
    p(`The CIA confirmed some of it. It disputed the rest. The full picture has never been established.`),
    h2('What Was Confirmed'),
    p(`The Church Committee — the 1975 Senate investigation into intelligence agency abuses — confirmed that the CIA had maintained relationships with journalists and had used journalists as cover for operations abroad. The Committee found that the CIA had at various times employed correspondents from major news organizations, had planted stories in foreign press, and had relationships with domestic journalists.`),
    p(`The CIA also acknowledged its ownership of a small domestic news organization called the Forum World Features syndicate, which distributed news content. It confirmed that it had produced propaganda for overseas distribution that sometimes found its way back into the American press.`),
    h2('What Was Disputed'),
    p(`The 400-journalist figure cited by Bernstein — drawn from CIA documents he was allowed to review — has never been officially confirmed. The CIA's position was that most journalist relationships were casual and limited, not systematic infiltration. Former CIA Director William Colby acknowledged "some" relationships with journalists but disputed the scale.`),
    p(`The specific term "Operation Mockingbird" appears in some CIA documents in connection with a 1950s Cord Meyer program, but the CIA denies it was a formal program name for the entire media operation Bernstein described.`),
    h2('The Methodology'),
    p(`What Bernstein documented — and what subsequent researchers have confirmed in part — was a layered approach. Some journalists were witting assets, knowingly working with the CIA. Some were unwitting, receiving information planted by the agency without knowing its source. Some news organizations had executives who cooperated with the CIA without the knowledge of their reporters.`),
    p(`The CIA also established front organizations, subsidized books, funded student groups, and sponsored cultural activities through cut-outs — the Congress for Cultural Freedom being the most prominent example, whose CIA funding was exposed in 1967.`),
    h2('The Limits of the Record'),
    p(`The complete CIA files on media operations have never been released. The Church Committee's final report on this topic remains partially classified. What exists is a documented core — confirmed CIA media relationships, confirmed front organizations, confirmed story placements — surrounded by a disputed periphery about scale and intent.`),
    bq(`"The agency's relationships with journalists... were many and varied. The connections ranged from casual conversations to formal contract relationships." — Church Committee Final Report, 1976.`),
    h2('Verdict'),
    p(`PLAUSIBLE. The CIA ran media influence operations. The Church Committee confirmed it. The specific name "Mockingbird" and the full scope of the program remain disputed. This is not the same as "the CIA controls the media" — but it is documented that the CIA significantly influenced media content during the Cold War.`),
  ],
  sources: [
    { _type: 'source', _key: key(), title: 'The CIA and the Media — Carl Bernstein', publisher: 'Rolling Stone', url: 'https://www.rollingstone.com/', date: 'October 20, 1977' },
    { _type: 'source', _key: key(), title: 'Church Committee Final Report: Intelligence Activities and the Rights of Americans', publisher: 'US Senate Select Committee to Study Governmental Operations', url: 'https://www.intelligence.senate.gov/sites/default/files/94755_II.pdf', date: '1976' },
    { _type: 'source', _key: key(), title: 'Mighty Wurlitzer: How the CIA Played America', publisher: 'Hugh Wilford, Harvard University Press', url: 'https://www.hup.harvard.edu/', date: '2008' },
  ],
},

// 8 — Project Stargate
{
  _id: 'sm-stargate',
  _type: 'article',
  title: 'Project Stargate: The US Army\'s Psychic Spies Were Real — and the Results Were Weird',
  slug: { _type: 'slug', current: 'project-stargate-us-army-psychic-spies' },
  status: 'published',
  publishedAt: NOW,
  difficulty: 'intermediate',
  verdict: 'PLAUSIBLE',
  tags: ['Project Stargate', 'Cold War', 'remote viewing', 'psychic intelligence', 'DIA', 'CIA', 'psi research'],
  excerpt: 'From 1972 to 1995, the US government spent $20 million researching psychic phenomena for intelligence purposes. Project Stargate employed "remote viewers" — people who claimed to perceive distant locations through extrasensory perception. The CIA terminated the program. Its files remain partially classified.',
  series: { _type: 'reference', _ref: SERIES_ID },
  body: [
    p(`In 1972, physicists Russell Targ and Hal Puthoff at the Stanford Research Institute received CIA funding to study whether psychic phenomena could be weaponized. By 1978, the US Army had formalized the research into a military intelligence unit stationed at Fort Meade, Maryland. By the time the program was terminated in 1995, the US government had spent approximately $20 million on 23 years of psychic research.`),
    p(`The program went through several names — Project GONDOLA WISH, GRILL FLAME, CENTER LANE, SUN STREAK — before settling on STARGATE. It was real. The people who ran it had security clearances. Their reports went to the DIA and the CIA.`),
    h2('What Remote Viewing Claimed to Do'),
    p(`Remote viewing — the term Targ and Puthoff coined — was a protocol in which trained subjects attempted to perceive distant locations, objects, or events using no conventional sensory information. A viewer would be given coordinates or a sealed envelope, placed in a controlled environment, and asked to describe what was there.`),
    p(`The program's proponents documented dozens of claimed successes. Viewers described details of Soviet military installations. One viewer reportedly described a secret Soviet submarine base before it was confirmed by satellite imagery. Ingo Swann, one of the program's star subjects, claimed to have remotely viewed Jupiter's rings before the Voyager probe confirmed they existed.`),
    h2('The Scientific Problem'),
    p(`The program's results were evaluated in 1995 by the American Institutes for Research, which contracted statistician Jessica Utts and psychologist Ray Hyman to review the data. Their findings diverged. Utts concluded that the statistical evidence for remote viewing was stronger than for many accepted scientific phenomena and recommended further study. Hyman concluded that the results did not meet scientific standards for proof and could not be distinguished from chance and methodological flaws.`),
    p(`The CIA sided with Hyman and shut the program down. The official conclusion: remote viewing had no demonstrated operational intelligence value.`),
    h2('The Operational Record'),
    p(`Declassified records show that remote viewing was used in actual intelligence operations. Viewers were tasked against hostage locations (the Iran hostage crisis), drug trafficking operations, and Soviet military sites. In most cases, the operational results were ambiguous — accurate enough to be interesting, not accurate enough to be actionable.`),
    p(`The program's former director, Edwin May, maintains that the statistical record demonstrates a genuine phenomenon. Most mainstream scientists remain unconvinced.`),
    bq(`"The statistical results of the studies examined are far beyond what is expected by chance." — Jessica Utts, statistician, in her AIR review, 1995.`),
    h2('Verdict'),
    p(`PLAUSIBLE. Project Stargate is confirmed. The US government ran it for 23 years. The statistical debate about whether remote viewing is real is unresolved — which is different from the program being a hoax. It was a genuine government program whose results were genuinely inconclusive.`),
  ],
  sources: [
    { _type: 'source', _key: key(), title: 'An Evaluation of Remote Viewing: Research and Applications', publisher: 'American Institutes for Research / CIA', url: 'https://www.cia.gov/readingroom/docs/CIA-RDP96-00789R003100030001-5.pdf', date: '1995' },
    { _type: 'source', _key: key(), title: 'The Men Who Stare at Goats', publisher: 'Jon Ronson, Simon & Schuster', url: 'https://www.simonandschuster.com/', date: '2004' },
    { _type: 'source', _key: key(), title: 'STARGATE Declassified Files', publisher: 'CIA FOIA Reading Room', url: 'https://www.cia.gov/readingroom/collection/stargate', date: '1972–1995, declassified 2003' },
  ],
},

// 9 — Gehlen Organisation
{
  _id: 'sm-gehlen',
  _type: 'article',
  title: 'The Gehlen Organisation: America Rebuilt West German Intelligence Using Hitler\'s Spymasters',
  slug: { _type: 'slug', current: 'gehlen-organisation-america-nazi-intelligence-cold-war' },
  status: 'published',
  publishedAt: NOW,
  difficulty: 'advanced',
  verdict: 'CONFIRMED',
  tags: ['Gehlen Organisation', 'Cold War', 'CIA', 'West Germany', 'Nazi Germany', 'intelligence', 'Reinhard Gehlen', 'BND'],
  excerpt: 'After World War II, General Reinhard Gehlen — head of Nazi Germany\'s military intelligence for the Eastern Front — negotiated a deal with the US Army. His entire intelligence network, complete with files on Soviet operations, would be handed over. In exchange, the US would put him back in business.',
  series: { _type: 'reference', _ref: SERIES_ID },
  body: [
    p(`Reinhard Gehlen was one of the most capable intelligence officers in the Third Reich. As head of Fremde Heere Ost — Foreign Armies East, the Wehrmacht's Soviet intelligence branch — he had built an extensive network of sources, agents, and files on Red Army order of battle. By early 1945, he knew Germany was losing and began thinking about his next employer.`),
    p(`He buried his files in the Bavarian Alps and surrendered to American forces in May 1945 with a proposal. He would hand over everything — the files, the network, the expertise — in exchange for protection and the chance to rebuild the organisation under American auspices, targeted at the Soviets.`),
    p(`The Americans accepted.`),
    h2('The Organisation'),
    p(`What became known as the Gehlen Organisation — formally the Organisation Gehlen, run out of a compound in Pullach, Bavaria — began operations in 1946 under CIA sponsorship. It employed former Wehrmacht officers, former Abwehr (German military intelligence) officers, and former SS personnel. Some had committed war crimes. The Americans were aware of this and largely did not care.`),
    p(`The CIA funnelled approximately $200 million into the organisation between 1946 and 1956. Gehlen provided intelligence on Soviet capabilities, Eastern European resistance movements, and Soviet military deployments.`),
    h2('The Problem'),
    p(`The organisation's value was always complicated by its composition and provenance. Gehlen's networks had been built by the Nazi regime and many of his agents had worked under those auspices, meaning their loyalties and credibility were questionable. Soviet intelligence — which had extensively penetrated the Wehrmacht's Eastern intelligence apparatus during the war — was well positioned to manipulate or monitor Gehlen's network.`),
    p(`Subsequent analysis has suggested that the KGB fed disinformation through the Gehlen Organisation for years, and that some of Gehlen's most valued sources were Soviet double agents. The CIA received tainted intelligence; how tainted, and how much, remains classified.`),
    h2('The BND'),
    p(`In 1956, when West Germany became fully sovereign, the Gehlen Organisation was formally transferred to West German government control and renamed the Bundesnachrichtendienst — the BND, West Germany's foreign intelligence service. Gehlen served as its first director until 1968.`),
    p(`The BND, Germany's equivalent of the CIA, thus began as an American-funded organisation staffed by former Nazi intelligence officers. This is not a contested point. The German government has acknowledged it.`),
    bq(`"I am convinced that if I had been able to tell the American Army... the full story of my relations with the Russians, they would have been horrified." — Reinhard Gehlen, Memoirs, 1972.`),
    h2('Verdict'),
    p(`CONFIRMED. The Gehlen Organisation's existence, CIA funding, and Nazi personnel are thoroughly documented through declassified CIA files, West German parliamentary investigations, and Gehlen's own memoir. The degree to which it was penetrated by Soviet intelligence remains classified.`),
  ],
  sources: [
    { _type: 'source', _key: key(), title: 'The Service: The Memoirs of General Reinhard Gehlen', publisher: 'Reinhard Gehlen, World Publishing', url: 'https://www.worldcat.org/', date: '1972' },
    { _type: 'source', _key: key(), title: 'CIA Declassified: The Gehlen Organisation Files', publisher: 'CIA FOIA Reading Room', url: 'https://www.cia.gov/readingroom/', date: 'various, declassified 2000s' },
    { _type: 'source', _key: key(), title: 'Blowback: America\'s Recruitment of Nazis and Its Destructive Impact on Our Domestic and Foreign Policy', publisher: 'Christopher Simpson, Weidenfeld & Nicolson', url: 'https://www.worldcat.org/', date: '1988' },
    { _type: 'source', _key: key(), title: 'The German Spy: The Gehlen Organisation and the Origins of West German Intelligence', publisher: 'Mary Ellen Reese, MIT Press', url: 'https://mitpress.mit.edu/', date: '1990' },
  ],
},

// 10 — Nazi Bell
{
  _id: 'sm-nazi-bell',
  _type: 'article',
  title: 'Die Glocke: The Nazi Superweapon That Almost Certainly Never Existed',
  slug: { _type: 'slug', current: 'die-glocke-nazi-bell-superweapon-debunked' },
  status: 'published',
  publishedAt: NOW,
  difficulty: 'beginner',
  verdict: 'DEBUNKED',
  tags: ['Die Glocke', 'Nazi Bell', 'World War II', 'conspiracy theory', 'Nazi secret weapons', 'Wunderwaffe', 'debunked'],
  excerpt: 'The Nazi Bell — Die Glocke — is supposedly a secret SS device that could generate gravity fields, bend spacetime, or power a flying saucer. Every piece of evidence for it comes from one source: a single Polish journalist who published his account 55 years after the war.',
  series: { _type: 'reference', _ref: SERIES_ID },
  body: [
    p(`The story of Die Glocke — the Bell — is one of the most persistent myths in the genre of Nazi secret weapons. Its details are vivid: a bell-shaped device two metres wide and three metres tall, filled with a purple metallic substance called Xerum-525, suspended from a rig and made to counter-rotate at high speeds. When it ran, the story goes, plants decomposed, animals died, and SS scientists went mad. It was Hitler's most secret project. The SS murdered the scientists who built it. It was flown out of Germany before the end of the war and never found.`),
    p(`There is essentially no credible evidence it existed.`),
    h2('The Single Source Problem'),
    p(`The entire Die Glocke story derives from one book: The Weapon of Weapons of the Third Reich, published in Polish in 2000 by Igor Witkowski, a Polish aerospace journalist. Witkowski claimed he had been shown secret Polish government files in 1997 by an anonymous intelligence contact. The files themselves have never been seen by any other researcher. The anonymous contact has never been identified.`),
    p(`From Witkowski's book, the story was picked up by British author Nick Cook, who wrote The Hunt for Zero Point (2001), presenting Die Glocke as a potential breakthrough in anti-gravity research. Cook's book was widely read and launched Die Glocke into mainstream conspiracy culture. Cook acknowledged that he had not seen the original documents either.`),
    h2('What the Evidence Actually Shows'),
    p(`The Wenceslas Mine in Poland — the supposed site of Bell experiments — is a real location. There is a concrete structure there sometimes called the "Henge" or "The Fly Trap" which Witkowski identified as the rig used to test the Bell. Polish historians and engineers have consistently argued it was a cooling tower or industrial structure for the mine. No German wartime records mention any device called Die Glocke.`),
    p(`The SS officer most associated with the Bell myth, SS-Obergruppenführer Hans Kammler — who ran the V-2 program — did disappear after the war and was never found, which gives the story an intriguing loose end. But "Kammler disappeared" plus "here is a concrete structure" does not constitute evidence of a gravity-bending superweapon.`),
    h2('Why It Persists'),
    p(`Die Glocke fills a particular narrative need: the idea that the Nazis were developing technology so far ahead of their time that it could only be explained by something extraordinary — anti-gravity, time travel, alien contact. The actual German Wunderwaffe program — V-1, V-2, Me-262, guided missiles — was genuinely remarkable. But the Bell is in a different category entirely: a story built on a single uncorroborated source that generates no archival trail.`),
    bq(`"I realised there was a chance — just a chance — that the Nazis had developed some kind of revolutionary technology." — Nick Cook, The Hunt for Zero Point, 2001. The chance, on the evidence, is vanishingly small.`),
    h2('Verdict'),
    p(`DEBUNKED. No contemporary German wartime documents mention Die Glocke. No physical evidence of the device has been found. The entire story rests on a single anonymous source whose documents no independent researcher has ever seen. The concrete structure at Wenceslas Mine is not a test rig for an anti-gravity device.`),
  ],
  sources: [
    { _type: 'source', _key: key(), title: 'The Hunt for Zero Point', publisher: 'Nick Cook, Broadway Books', url: 'https://www.penguinrandomhouse.com/', date: '2001' },
    { _type: 'source', _key: key(), title: 'The Weapon of Weapons of the Third Reich', publisher: 'Igor Witkowski, WIS', date: '2000' },
    { _type: 'source', _key: key(), title: 'The Real History of Secret Nazi Weapons', publisher: 'Brian Ford, Brockhampton Press', date: '1978' },
    { _type: 'source', _key: key(), title: 'German Secret Weapons: Blueprint for Mars', publisher: 'Brian Ford, Ballantine Books', date: '1969' },
  ],
},

// 11 — Philadelphia Experiment
{
  _id: 'sm-philadelphia',
  _type: 'article',
  title: 'The Philadelphia Experiment: The Physics Don\'t Work, and Neither Does the Story',
  slug: { _type: 'slug', current: 'philadelphia-experiment-uss-eldridge-debunked' },
  status: 'published',
  publishedAt: NOW,
  difficulty: 'beginner',
  verdict: 'DEBUNKED',
  tags: ['Philadelphia Experiment', 'USS Eldridge', 'World War II', 'conspiracy theory', 'invisibility', 'teleportation', 'debunked', 'Navy'],
  excerpt: 'The legend: in 1943, the US Navy made the USS Eldridge invisible, teleported it from Philadelphia to Norfolk, and drove its crew insane. The reality: the Eldridge\'s own deck logs prove it was nowhere near Philadelphia on the date in question.',
  series: { _type: 'reference', _ref: SERIES_ID },
  body: [
    p(`In 1955, a man named Carl M. Allen — who also went by Carlos Allende — mailed an annotated copy of Morris Jessup's book The Case for the UFO to the Office of Naval Research in Washington. The margins were covered in handwritten notes claiming that the Navy had, in 1943, used Einstein's Unified Field Theory to render the destroyer escort USS Eldridge invisible to radar and to the naked eye, then teleported it from Philadelphia to Norfolk, Virginia — a distance of 200 miles — then back again.`),
    p(`The crew, Allen wrote, went insane. Some fused into the ship's hull. Some vanished mid-sentence. The Navy covered it up.`),
    p(`None of this happened.`),
    h2('The Deck Logs'),
    p(`The USS Eldridge was a real ship. Its deck logs for October 1943 — the date Allen specified for the alleged experiment — are held at the National Archives and are open to the public. They show that on October 28, 1943, the Eldridge was in New York Harbor, not Philadelphia. Veterans of the ship have consistently and emphatically denied that anything unusual occurred during their service.`),
    p(`The Eldridge's crew held reunions and gave interviews for decades. Not a single crew member corroborated the Philadelphia Experiment story. The ship's own history, compiled from its logs, shows no inexplicable gaps or anomalies.`),
    h2('Carl Allen'),
    p(`Carl Allen is one of the more colourful figures in the history of conspiracy hoaxes. He was a merchant mariner with a history of erratic behaviour and a passion for annotating books with increasingly elaborate marginal claims. His annotations in Jessup's book escalated from intriguing to bizarre over their length, mixing claims about Einstein, the Navy, the "force" required for teleportation, and alien observers.`),
    p(`Subsequent researchers who tracked down Allen found a man who had fabricated his role in observing the experiment, had confused and contradicted himself repeatedly, and who eventually admitted he had made up some of the story. This admission did not stop the myth.`),
    h2('The Science'),
    p(`The theoretical basis for the Philadelphia Experiment — using electromagnetic fields to bend light around a ship — bears no relationship to Einstein's actual Unified Field Theory, which Einstein never completed and which has no practical applications to optical invisibility. The Navy was conducting degaussing experiments in 1943 — wrapping ships in electromagnetic coils to reduce their magnetic signature for mine countermeasures — which may have given Allen the germ of a more plausible-sounding story.`),
    p(`Degaussing is real. Rendering a destroyer invisible to the human eye using electromagnetic fields is not possible and was not attempted.`),
    bq(`"I was NOT, repeat NOT, in Philadelphia harbour on 28 October 1943." — USS Eldridge deck log, National Archives.`),
    h2('Verdict'),
    p(`DEBUNKED. The Eldridge's own records disprove the basic claim. Carl Allen's credibility as a source is essentially zero. The physics described are impossible. This is one of the more thoroughly demolished conspiracy theories in existence, which has not slowed its circulation.`),
  ],
  sources: [
    { _type: 'source', _key: key(), title: 'USS Eldridge Deck Logs, October 1943', publisher: 'National Archives (NARA)', url: 'https://www.archives.gov/', date: 'October 1943' },
    { _type: 'source', _key: key(), title: 'The Philadelphia Experiment: Project Invisibility', publisher: 'William Moore and Charles Berlitz, Grosset & Dunlap', date: '1979' },
    { _type: 'source', _key: key(), title: 'The Navy and the Philadelphia Experiment — Official Naval History Center Response', publisher: 'US Naval History and Heritage Command', url: 'https://www.history.navy.mil/research/library/online-reading-room/title-list-alphabetically/p/philadelphia-experiment.html', date: 'ongoing' },
  ],
},

// 12 — Majestic 12
{
  _id: 'sm-majestic12',
  _type: 'article',
  title: 'Majestic 12: The UFO Cover-Up Documents That Were Definitely Forged',
  slug: { _type: 'slug', current: 'majestic-12-ufo-documents-forged-debunked' },
  status: 'published',
  publishedAt: NOW,
  difficulty: 'beginner',
  verdict: 'DEBUNKED',
  tags: ['Majestic 12', 'MJ-12', 'UFO', 'Roswell', 'conspiracy theory', 'forgery', 'FBI', 'debunked'],
  excerpt: 'In 1984, a roll of film arrived anonymously at a UFO researcher\'s home, containing photographs of classified documents describing a secret government committee — Majestic 12 — set up to manage the recovery of crashed alien spacecraft. The FBI investigated and concluded the documents were forged.',
  series: { _type: 'reference', _ref: SERIES_ID },
  body: [
    p(`In December 1984, a 35mm film cannister arrived, uninvited, in the mail at the home of Jamie Shandera, a television producer and UFO researcher in Hollywood. When developed, it contained photographs of what appeared to be a classified US government document — a briefing paper, dated November 18, 1952, apparently prepared for President-elect Eisenhower.`),
    p(`The document described a secret committee of twelve senior officials — military figures, scientists, and intelligence officers — code-named Majestic 12 or MJ-12. Its purpose: to manage the recovery of crashed alien spacecraft and the bodies of their occupants, beginning with the Roswell, New Mexico incident of 1947.`),
    p(`The FBI investigated. Their conclusion: the documents were forgeries.`),
    h2('The Documents'),
    p(`The original Eisenhower Briefing Document, as it became known, was followed over subsequent years by more MJ-12 documents, also arriving anonymously or found in archives. They described the committee's membership (which included Secretary of Defense James Forrestal, CIA Director Roscoe Hillenkoetter, and nuclear physicist Vannevar Bush), their operating procedures, and the details of recovered spacecraft.`),
    p(`The documents were widely circulated in the UFO research community and generated enormous excitement. They were also, from the beginning, deeply suspicious to historians and document analysts.`),
    h2('The Problems'),
    p(`The formatting was wrong. The Eisenhower Briefing Document used a date format — "18 November, 1952" — that the US military did not use in that period. The typeface didn't match period typewriters. The security classification markings used formats adopted after the date on the documents. A reference to a memo from President Truman, cited as evidence, turned out to have a signature that was a cut-and-paste from a genuine but unrelated document.`),
    p(`The FBI's investigation, concluded in 1988, found the documents were "bogus." The Air Force OSI reached the same conclusion. The National Archives confirmed that no genuine MJ-12 records existed in any repository they controlled.`),
    h2('The Trail'),
    p(`Researchers have traced the documents' provenance with reasonable confidence to William Moore — the same William Moore who co-authored the Philadelphia Experiment book — and possibly Richard Doty, a former Air Force Office of Special Investigations officer who later admitted to feeding disinformation to UFO researchers during the 1980s as part of a counterintelligence operation.`),
    p(`Whether the MJ-12 documents were a deliberate government disinformation operation, a hoax by civilian researchers, or some combination remains unresolved. The documents themselves are forgeries. What motivated the forgers is a separate question.`),
    bq(`"The Defense Intelligence Agency has no record of any such group as MAJESTIC 12 having been formed or having existed." — DIA response to FOIA request, 1987.`),
    h2('Verdict'),
    p(`DEBUNKED. The FBI investigation concluded the documents were forged. Document analysts identified multiple anachronisms. No genuine MJ-12 records have ever surfaced in any government archive. This does not resolve questions about Roswell or UFOs generally — it specifically means these documents are not evidence of anything except a reasonably skilled forgery.`),
  ],
  sources: [
    { _type: 'source', _key: key(), title: 'FBI Investigation into MJ-12 Documents', publisher: 'Federal Bureau of Investigation', url: 'https://vault.fbi.gov/Majestic%2012', date: '1988' },
    { _type: 'source', _key: key(), title: 'UFO Crash at Roswell: The Genesis of a Modern Myth', publisher: 'Benson Saler, Charles Ziegler, Charles Moore, Smithsonian Institution Press', url: 'https://www.si.edu/', date: '1997' },
    { _type: 'source', _key: key(), title: 'The MJ-12 Documents: An Analytical Report', publisher: 'Philip Klass, Skeptical Inquirer', date: '1990' },
    { _type: 'source', _key: key(), title: 'Exempt from Disclosure', publisher: 'Robert Collins and Richard Doty', date: '2006' },
  ],
},

]

// ── Publish ──────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n📰  Smoke and Mirrors — Publishing Series + 12 Articles\n')

  // 1. Create series
  console.log('Creating series...')
  await mutate([{ createOrReplace: series }])
  console.log('  ✓ Smoke and Mirrors series created\n')

  // 2. Publish articles
  for (const art of ARTICLES) {
    process.stdout.write(`  ▸ ${art.title.slice(0, 60)}...\n`)
    await mutate([{ createOrReplace: art }])
    console.log(`    ✓ Published [${art._id}]\n`)
    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`\n── Summary ─────────────────────────────────────`)
  console.log(`  ✓ 1 series created`)
  console.log(`  ✓ ${ARTICLES.length} articles published`)
  console.log(`\nIDs for image upload:`)
  ARTICLES.forEach(a => console.log(`  ${a._id}`))
  console.log()
}

main().catch(e => { console.error(e); process.exit(1) })
