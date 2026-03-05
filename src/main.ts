import * as BunnySDK from "https://esm.sh/@bunny.net/edgescript-sdk@0.12.0";

// --- Word List (~200 common 5-letter words) ---
const WORDS = [
  "ABOUT","ABOVE","ACUTE","ADMIT","ADOPT","AGENT","AGREE","ALARM","ALBUM","ALERT",
  "ALIEN","ALIGN","ALLEY","ALLOW","ALONE","AMAZE","AMPLE","ANGEL","ANGER","ANGLE",
  "APPLE","ARENA","ARISE","ARMOR","ASIDE","AWAKE","BADGE","BASIC","BEACH","BEGIN",
  "BEING","BELOW","BENCH","BLACK","BLADE","BLAME","BLANK","BLAST","BLAZE","BLEED",
  "BLEND","BLESS","BLIND","BLOCK","BLOOD","BLOOM","BOARD","BONUS","BOOST","BOUND",
  "BRAIN","BRAND","BRAVE","BREAD","BREAK","BREED","BRICK","BRIEF","BRING","BROAD",
  "BROWN","BRUSH","BUILD","BURST","CABIN","CANDY","CARRY","CATCH","CAUSE","CHAIN",
  "CHAIR","CHARM","CHASE","CHEAP","CHECK","CHEST","CHIEF","CHILD","CHINA","CHOSE",
  "CIVIL","CLAIM","CLASS","CLEAN","CLEAR","CLIMB","CLING","CLOCK","CLOSE","CLOUD",
  "COACH","COAST","COLOR","COMET","CORAL","COUNT","COURT","COVER","CRACK","CRAFT",
  "CRANE","CRASH","CRAZY","CREAM","CREEP","CRIME","CROSS","CROWD","CROWN","CRUEL",
  "CRUSH","CURVE","CYCLE","DANCE","DEATH","DEBUG","DELAY","DENSE","DEPOT","DEPTH",
  "DIARY","DIRTY","DITCH","DOUBT","DRAFT","DRAIN","DRAMA","DRANK","DRAWN","DREAM",
  "DRESS","DRIED","DRIFT","DRILL","DRINK","DRIVE","DROIT","DRONE","DROVE","DYING",
  "EAGER","EARLY","EARTH","EIGHT","ELECT","ELITE","EMBED","EMBER","EMPTY","ENEMY",
  "ENJOY","ENTER","EQUAL","ERROR","EVENT","EVERY","EXACT","EXAMS","EXIST","EXTRA",
  "FABLE","FAITH","FALSE","FANCY","FATAL","FAULT","FEAST","FENCE","FEVER","FIBER",
  "FIELD","FIFTH","FIFTY","FIGHT","FINAL","FIRST","FLAME","FLASH","FLEET","FLESH",
  "FLOAT","FLOOD","FLOOR","FLOUR","FLUID","FLUSH","FLUTE","FOCUS","FORCE","FORGE",
  "FORTH","FORUM","FOUND","FRAME","FRANK","FRAUD","FRESH","FRONT","FROST","FRUIT",
];

// Valid guesses (broader dictionary of accepted 5-letter English words)
const VALID_GUESSES = new Set([
  ...WORDS,
  "ABACK","ABASE","ABATE","ABBEY","ABBOT","ABIDE","ABLED","ABODE","ABORT","ABOUND",
  "ABUSE","ABYSS","ACORN","ACRID","ACTOR","ADAPT","ADEPT","ADMIN","ADORE","ADORN",
  "ADULT","AEGIS","AFOOT","AFTER","AGAIN","AGAPE","AGATE","AGING","AGLOW","AGONY",
  "AIDER","AIMED","AISLE","ALGAE","ALIBI","ALLOT","ALLOY","ALOFT","ALONG","ALOOF",
  "ALTAR","ALTER","AMASS","AMBER","AMEND","MIDST","AMINO","AMISS","AMITY","AMONG",
  "ANGST","ANIME","ANKLE","ANNEX","ANNOY","ANTIC","ANVIL","AORTA","APART","APHID",
  "APPLE","APPLY","APRON","APTLY","ARBOR","ARDOR","ARGON","ARGUE","ARRAY","ARROW",
  "ARSON","ASHEN","ASSET","ATLAS","ATONE","ATTIC","AUDIO","AUDIT","AUGUR","AUNTY",
  "AVAIL","AVERT","AVOID","AWAIT","AWASH","AWFUL","AXIAL","AXIOM","BACON","BADGE",
  "BADLY","BAGEL","BAGGY","BAKER","BALER","BALMY","BANAL","BANDS","BARGE","BARON",
  "BASED","BASIN","BASIS","BATCH","BATHE","BATON","BEAST","BEGAN","BEIGE","BELLY",
  "BERRY","BICEP","BIGOT","BILLY","BINGO","BIOME","BIRCH","BIRTH","BISON","BLANK",
  "BLARE","BLAST","BLEAT","BLEED","BLIMP","BLINK","BLISS","BLITZ","BLOAT","BLOKE",
  "BLOND","BLOWN","BLUES","BLUFF","BLUNT","BLURB","BLURT","BLUSH","BOGUS","BOILS",
  "BOLTS","BONDS","BONES","BOOKS","BOOTH","BOOZE","BOOZY","BORNE","BOSOM","BOSSY",
  "BOTCH","BOUND","BOWED","BOWEL","BOXER","BRACE","BRAID","BRAKE","BRAND","BRASH",
  "BRASS","BRAWL","BRAWN","BREAD","BRIAR","BRIBE","BRIDE","BRINE","BRINK","BRINY",
  "BRISK","BROIL","BROKE","BROOD","BROOK","BROTH","BRUNT","BUDGE","BUGGY","BUGLE",
  "BULGE","BULKY","BULLY","BUNCH","BUNNY","BURNS","BUTCH","BUYER","BYLAW","CABLE",
  "CACHE","CADET","CAMEL","CAMEO","CANAL","CANNY","CANOE","CAPER","CAPUT","CARGO",
  "CAROL","CARVE","CASTE","CAUSAL","CEDAR","CHAIN","CHALK","CHAMP","CHANT","CHAOS",
  "CHARD","CHART","CHASM","CHEAP","CHEAT","CHEEK","CHEER","CHESS","CHICK","CHIDE",
  "CHILI","CHILL","CHIME","CHINA","CHIRP","CHOKE","CHORD","CHORE","CHOSE","CHUNK",
  "CHURN","CIDER","CIGAR","CINCH","CIVIC","CLACK","CLASP","CLAW","CLEAN","CLERK",
  "CLICK","CLIFF","CLIMB","CLINE","CLINK","CLOAK","CLONE","CLOTH","CLOUT","CLOWN",
  "CLUBS","CLUCK","CLUMP","CLUNG","COALS","COBRA","COILS","COMMA","CONCH","CONDO",
  "CORAL","CORDS","CORPS","COUCH","COULD","COUPE","COVEN","COVET","CRACK","CRAMP",
  "CRATE","CRAVE","CRAWL","CRAZE","CREAK","CREDO","CREEK","CREPE","CREST","CREWS",
  "CRIMP","CRISP","CROAK","CROCK","CRONE","CRONY","CROOK","CROPS","CROUCH","CRUDE",
  "CRUET","CRUMB","CRUSH","CRUST","CUBIC","CUMIN","CUPID","CURLY","CURRY","CUTIE",
  "CYBER","DAILY","DAIRY","DAISY","DALLY","DANCE","DATED","DEALS","DEALT","DECAY",
  "DECAL","DECOR","DECOY","DECRY","DEFER","DEITY","DELTA","DELVE","DEMON","DEMUR",
  "DENIM","DENSE","DEPOT","DERBY","DETOX","DEUCE","DEVIL","DIARY","DICEY","DIGIT",
  "DIMER","DIMLY","DINER","DINGY","DIRTY","DISCO","DITTO","DITTY","DIVER","DIZZY",
  "DODGE","DODGY","DOING","DOLLY","DONOR","DONUT","DOPEY","DOUBT","DOUGH","DOWDY",
  "DOWNS","DOWRY","DOZED","DRAFT","DRAIN","DRAKE","DRAPE","DRAWL","DRAWN","DREAD",
  "DRIED","DRIFT","DRILL","DROIT","DROLL","DROOL","DROOP","DROPS","DROSS","DROVE",
  "DROWN","DRUGS","DRUMS","DRUNK","DRYER","DRYLY","DUCHY","DULLY","DUNCE","DUSKY",
  "DUSTY","DWARF","DWELL","DWELT","DYING","EAGER","EASEL","EATEN","EATER","EBONY",
  "EDGED","EDICT","EERIE","EIGHT","ELDER","ELECT","ELFIN","ELIDE","ELITE","ELOPE",
  "ELUDE","ELVES","EMAIL","EMCEE","EMOJI","EMOTE","EMPTY","ENDED","ENDOW","ENEMA",
  "ENEMY","ENJOY","ENNUI","ENSUE","ENTRY","ENVOY","EPOCH","EPOXY","EQUIP","ERASE",
  "ERODE","ERUPT","ESSAY","ETHER","ETHIC","ETHOS","EVADE","EVENT","EVERY","EVICT",
  "EVOKE","EXACT","EXALT","EXAMS","EXCEL","EXERT","EXILE","EXPAT","EXPEL","EXTOL",
  "EXTRA","EXUDE","EXULT","FABLE","FACET","FAIRY","FAKER","FANCY","FATAL","FAUNA",
  "FEAST","FEAST","FEIGN","FEINT","FELLA","FELON","FEMUR","FERRY","FETCH","FETID",
  "FEWER","FIBER","FIBRE","FICUS","FIELD","FIEND","FIERY","FIFTH","FIFTY","FILTH",
  "FINCH","FIRED","FLAIR","FLAKY","FLAME","FLANK","FLARE","FLASK","FLAXY","FLEDGE",
  "FLESH","FLICK","FLIER","FLING","FLINT","FLIRT","FLOCK","FLORA","FLOSS","FLOUR",
  "FLOWN","FLUFF","FLUID","FLUKE","FLUNG","FLUNK","FLUSH","FOCAL","FOGGY","FOILS",
  "FOLLY","FORAY","FORGE","FORGO","FORTH","FORTY","FOSSIL","FOUND","FOYER","FRAIL",
  "FRANC","FRANK","FREAK","FREED","FRESH","FRIAR","FRIED","FRILL","FRISK","FRITZ",
  "FRIZZ","FROCK","FROND","FROST","FROTH","FROZE","FRUIT","FRUMP","FULLY","FUNGI",
  "FUNKY","FUNNY","FURRY","FUSSY","FUZZY","GAFFE","GAILY","GAMMA","GAMUT","GAUGE",
  "GAUZE","GAVEL","GAWKY","GEEKY","GENIE","GENRE","GHOST","GIANT","GIDDY","GIVEN",
  "GIVER","GLADE","GLAND","GLARE","GLASS","GLAZE","GLEAM","GLEAN","GLIDE","GLINT",
  "GLOAT","GLOBE","GLOOM","GLORY","GLOSS","GLOVE","GNARLY","GNASH","GNOME","GOING",
  "GOLEM","GOLLY","GONAD","GONNA","GOODY","GOOEY","GOOSE","GORGE","GOUGE","GOURD",
  "GRACE","GRADE","GRAFT","GRAIN","GRAND","GRANT","GRAPE","GRAPH","GRASP","GRASS",
  "GRATE","GRAVE","GRAVY","GRAZE","GREAT","GREED","GREEN","GREET","GRIEF","GRILL",
  "GRIME","GRIMY","GRIND","GRIPE","GROAN","GROIN","GROOM","GROPE","GROSS","GROUP",
  "GROUT","GROVE","GROWL","GROWN","GRUEL","GRUFF","GRUMP","GRUNT","GUARD","GUESS",
  "GUIDE","GUILD","GUILT","GUISE","GULCH","GULLY","GUMBO","GUMMY","GUPPY","GUSTO",
  "GUSTY","GUTTER","GYPSY","HABIT","HAIRY","HALVE","HANDY","HAPPY","HARDY","HASTE",
  "HASTY","HATCH","HAUNT","HAVEN","HAZEL","HEADY","HEARD","HEART","HEAVY","HEDGE",
  "HEFTY","HEIST","HELIX","HELLO","HENCE","HERBS","HILLY","HINGE","HIPPO","HIPPY",
  "HITCH","HOARD","HOBBY","HOMER","HONEY","HONOR","HORSE","HOTEL","HOTLY","HOUND",
  "HOUSE","HOVER","HOWDY","HUMAN","HUMID","HUMPS","HUMUS","HURRY","HUSKY","HYENA",
  "HYPER","ICILY","ICING","IDEAL","IDIOT","IMAGE","IMBUE","IMPLY","INANE","INBOX",
  "INCUR","INDEX","INEPT","INERT","INFER","INGOT","INNER","INPUT","INTER","INTRO",
  "IONIC","IRATE","IRONY","IVORY","JAUNT","JAZZY","JELLY","JENNY","JERKY","JEWEL",
  "JIFFY","JOINT","JOKER","JOLLY","JOUST","JUDGE","JUICE","JUICY","JUMBO","JUMPY",
  "JUROR","KARMA","KAYAK","KEBAB","KHAKI","KINKY","KIOSK","KNACK","KNEAD","KNEEL",
  "KNELT","KNIFE","KNOCK","KNOLL","KNOWN","KOALA","KUDOS","LABEL","LABOR","LADEN",
  "LANCE","LAPEL","LAPSE","LARGE","LARVA","LATCH","LATER","LATHE","LATTE","LAUGH",
  "LAYER","LEACH","LEAFY","LEAKY","LEAPT","LEARN","LEASE","LEASH","LEAST","LEAVE",
  "LEDGE","LEECH","LEGAL","LEGGY","LEMON","LEVEL","LEVER","LIGHT","LILAC","LIMBO",
  "LINEN","LINER","LINGO","LIPID","LIVID","LLAMA","LOBBY","LOCAL","LODGE","LOFTY",
  "LOGIC","LOGIN","LONELY","LOOSE","LORRY","LOSER","LOSSY","LOTUS","LOUSY","LOVER",
  "LOWER","LOYAL","LUCID","LUCKY","LUMPY","LUNAR","LUNCH","LUNGE","LUSTY","LYING",
  "LYRIC","MACAW","MACHO","MACRO","MAFIA","MAGIC","MAGMA","MAJOR","MAKER","MAMBO",
  "MAMMA","MANGE","MANGO","MANIA","MANOR","MAPLE","MARCH","MARRY","MARSH","MASON",
  "MATCH","MATTE","MAYOR","MEALY","MEANT","MEATY","MEDAL","MEDIA","MEDIC","MELEE",
  "MELON","MERCY","MERGE","MERIT","MERRY","MESSY","METAL","METER","MIDST","MIGHT",
  "MINCE","MINOR","MINUS","MIRTH","MISER","MISTY","MITRE","MODEL","MODEM","MOGUL",
  "MOIST","MOLAR","MOLDY","MONEY","MONTH","MOODY","MOOSE","MORAL","MORPH","MOSSY",
  "MOTEL","MOTIF","MOTOR","MOTTO","MOULD","MOULT","MOUND","MOUNT","MOURN","MOUSE",
  "MOUSY","MOUTH","MOVER","MOVIE","MUCKY","MUCUS","MUDDY","MUGGY","MULCH","MUMMY",
  "MURAL","MURKY","MUSHY","MUSIC","MUSKY","MUSTY","MYRRH","NADIR","NAIVE","NANNY",
  "NASAL","NASTY","NAVAL","NERVE","NEVER","NEWLY","NICHE","NIGHT","NINJA","NITTY",
  "NOBLE","NOBLY","NOISE","NOISY","NOMAD","NORTH","NOTCH","NOTED","NOVEL","NUDGE",
  "NURSE","NUTTY","NYLON","OASIS","OCCUR","OCEAN","OFFER","OFTEN","OLIVE","OMEGA",
  "ONSET","OPTIC","ORBIT","ORDER","ORGAN","OTHER","OUGHT","OUNCE","OUTDO","OUTER",
  "OVERT","OWNER","OXIDE","OZONE","PADDY","PAGAN","PAINT","PALMS","PANDA","PANEL",
  "PANIC","PANSY","PAPAL","PAPER","PARSE","PARTY","PASTA","PASTE","PATCH","PATIO",
  "PAUSE","PEARL","PECAN","PEDAL","PENNY","PERCH","PERIL","PERKY","PESKY","PETAL",
  "PETTY","PHASE","PHONE","PHOTO","PIANO","PICKY","PIECE","PIGGY","PILOT","PINCH",
  "PINKY","PIOUS","PIXEL","PIXIE","PIZZA","PLACE","PLAID","PLAIN","PLAIT","PLANE",
  "PLANK","PLANT","PLATE","PLAZA","PLEAD","PLEAT","PLIED","PLIER","PLUCK","PLUMB",
  "PLUME","PLUMP","PLUMS","PLUNK","PLUSH","PLYER","POACH","POINT","POISE","POKER",
  "POLAR","POLKA","POLYP","POPPY","PORCH","POSER","POSIT","POSSE","POUCH","POUND",
  "POWER","PRANK","PRAWN","PRESS","PRICE","PRIDE","PRICK","PRIME","PRIMO","PRINT",
  "PRIOR","PRISM","PRIVY","PRIZE","PROBE","PRONE","PRONG","PROOF","PROSE","PROUD",
  "PROVE","PROWL","PROXY","PRUDE","PRUNE","PSALM","PUDGY","PULSE","PUNCH","PUPIL",
  "PUPPY","PURGE","PURSE","PUSHY","PUTTY","PYGMY","QUACK","QUAIL","QUALM","QUEEN",
  "QUERY","QUEST","QUEUE","QUICK","QUIET","QUILL","QUIRK","QUOTA","QUOTE","RABBI",
  "RABID","RACER","RADAR","RADIO","RAINY","RAISE","RALLY","RANCH","RANGE","RAPID",
  "RATIO","RAVEN","RAYON","RAZOR","REACH","REACT","READY","REALM","REBEL","REBUS",
  "RECAP","RECUR","REDUX","REGAL","REHAB","REIGN","RELAX","RELAY","RELIC","REMIT",
  "RENAL","RENEW","REPAY","REPEL","REPLY","RESIN","RETCH","RETRO","RETRY","REUSE",
  "REVEL","RIDER","RIDGE","RIFLE","RIGHT","RIGID","RIGOR","RINSE","RISEN","RISKY",
  "RIVAL","RIVER","RIVET","ROACH","ROAST","ROBIN","ROBOT","ROCKY","ROGUE","ROUGE",
  "ROUGH","ROUND","ROUSE","ROUTE","ROVER","ROWDY","ROYAL","RUGBY","RULER","RUMBA",
  "RUMOR","RUPEE","RURAL","RUSTY","SABLE","SADLY","SAINT","SALAD","SALON","SALSA",
  "SALTY","SALVE","SALVO","SANDY","SANER","SAPLING","SASSY","SAUCE","SAUCY","SAUNA",
  "SAVOR","SAVVY","SCALD","SCALE","SCALP","SCAM","SCAMP","SCANT","SCARE","SCARF",
  "SCARY","SCENE","SCENT","SCORE","SCORN","SCOUT","SCOWL","SCRAM","SCRAP","SCREE",
  "SCREW","SCRUB","SEAMY","SEDAN","SEGUE","SEIZE","SENSE","SERUM","SERVE","SETUP",
  "SEVEN","SEVER","SHALL","SHAME","SHANK","SHAPE","SHARD","SHARE","SHARK","SHARP",
  "SHAVE","SHAWL","SHEAR","SHEEN","SHEEP","SHEER","SHEET","SHELF","SHELL","SHIFT",
  "SHINE","SHINY","SHIRE","SHIRT","SHOCK","SHORE","SHORT","SHOUT","SHOVE","SHOWN",
  "SHOWY","SHRUB","SHRUG","SIDED","SIEGE","SIGHT","SIGMA","SILKY","SILLY","SINCE",
  "SIREN","SISSY","SIXTH","SIXTY","SIZED","SKATE","SKELP","SKIER","SKILL","SKIMP",
  "SKULL","SKUNK","SLACK","SLAIN","SLANG","SLANT","SLASH","SLATE","SLAVE","SLEEK",
  "SLEEP","SLEET","SLICE","SLIDE","SLIME","SLIMY","SLING","SLINK","SLOPE","SLOTH",
  "SLUGS","SLUMP","SLUNG","SLUNK","SLURP","SMACK","SMALL","SMART","SMASH","SMEAR",
  "SMELL","SMELT","SMILE","SMIRK","SMITH","SMOCK","SMOKE","SMOKY","SNACK","SNAIL",
  "SNAKE","SNARE","SNARL","SNEAK","SNEER","SNIDE","SNIFF","SNORE","SNORT","SNOUT",
  "SNOWY","SOAPY","SOBER","SOLAR","SOLID","SOLVE","SONIC","SORRY","SOUND","SOUTH",
  "SPACE","SPADE","SPARE","SPARK","SPAWN","SPEAK","SPEAR","SPECK","SPEED","SPELL",
  "SPEND","SPENT","SPICE","SPICY","SPIED","SPIKE","SPILL","SPINE","SPITE","SPLIT",
  "SPOKE","SPOON","SPORT","SPOUT","SPRAY","SPREE","SPRIG","SPUNK","SQUAT","SQUID",
  "STACK","STAFF","STAGE","STAIN","STAIR","STAKE","STALE","STALL","STAMP","STAND",
  "STANK","STARE","STARK","START","STASH","STATE","STAVE","STAYS","STEAK","STEAL",
  "STEAM","STEEL","STEEP","STEER","STERN","STICK","STIFF","STILL","STING","STINK",
  "STINT","STOCK","STOIC","STOKE","STOLE","STOMP","STONE","STONY","STOOD","STOOL",
  "STOOP","STORE","STORK","STORM","STORY","STOUT","STOVE","STRAP","STRAW","STRAY",
  "STRIP","STRUT","STUCK","STUDY","STUFF","STUMP","STUNG","STUNK","STUNT","SUGAR",
  "SUITE","SULKY","SUNNY","SUPER","SURGE","SUSHI","SWAMP","SWARM","SWEAR","SWEAT",
  "SWEEP","SWEET","SWELL","SWEPT","SWIFT","SWILL","SWINE","SWING","SWIRL","SWOON",
  "SWOOP","SWORD","SWORE","SWORN","SWUNG","SYRUP","TABBY","TABLE","TACIT","TAKEN",
  "TALLY","TALON","TANGO","TANGY","TAPIR","TARDY","TAROT","TASTE","TASTY","TATTY",
  "TAUNT","TAWNY","TEACH","TEETH","TEMPO","TENSE","TENTH","TEPEE","TEPID","TERMS",
  "TERSE","THEME","THERE","THICK","THIEF","THIGH","THING","THINK","THIRD","THORN",
  "THOSE","THREE","THREW","THROW","THRUM","THUMB","THUMP","TIARA","TIGER","TIGHT",
  "TIMER","TIMID","TIPSY","TITAN","TITLE","TOAST","TODAY","TOKEN","TOTAL","TOUGH",
  "TOWEL","TOWER","TOXIC","TRACE","TRACK","TRADE","TRAIL","TRAIN","TRAIT","TRAMP",
  "TRASH","TRAWL","TREAT","TREND","TRIAL","TRIBE","TRICK","TRIED","TRITE","TROLL",
  "TROOP","TROPE","TROUT","TRUCK","TRULY","TRUMP","TRUNK","TRUSS","TRUST","TRUTH",
  "TUBAL","TULIP","TUMOR","TUNER","TUNIC","TURBO","TUTOR","TWANG","TWEAK","TWEED",
  "TWEET","TWICE","TWINE","TWIST","TYING","UDDER","ULCER","ULTRA","UMBRA","UNCLE",
  "UNCUT","UNDER","UNDID","UNDUE","UNFIT","UNFED","UNION","UNITE","UNITY","UNLIT",
  "UNMET","UNTIL","UPPER","UPSET","URBAN","USAGE","USHER","USING","USUAL","UTTER",
  "VAGUE","VALID","VALOR","VALUE","VALVE","VAPID","VAULT","VAUNT","VEGAN","VENUE",
  "VERGE","VERSE","VIBES","VIDEO","VIGOR","VINYL","VIOLA","VIPER","VIRAL","VIRUS",
  "VISIT","VISOR","VISTA","VITAL","VIVID","VOCAL","VODKA","VOGUE","VOICE","VOILA",
  "VOTER","VOUCH","VOWEL","VULVA","WACKY","WADER","WAFER","WAGER","WAGON","WAIST",
  "WAKEN","WALKS","WALLS","WALTZ","WANNA","WATCH","WATER","WEARY","WEAVE","WEDGE",
  "WEEDY","WEIGH","WEIRD","WHALE","WHEAT","WHEEL","WHERE","WHICH","WHILE","WHIFF",
  "WHINE","WHINY","WHIRL","WHISK","WHITE","WHOLE","WHOSE","WIDEN","WIDER","WIDOW",
  "WIDTH","WIELD","WINDY","WITCH","WIVES","WOMAN","WOMEN","WOODS","WOODY","WOOLY",
  "WORLD","WORMY","WORRY","WORSE","WORST","WORTH","WOULD","WOUND","WRACK","WRATH",
  "WREAK","WRECK","WRING","WRIST","WRITE","WRONG","WROTE","YACHT","YEARN","YEAST",
  "YIELD","YOUNG","YOUTH","ZEBRA","ZESTY",
]);

// --- Token encoding (obfuscate word in client-held token) ---
const SECRET_KEY = "BunnyWordle2024!";

function encodeToken(word: string): string {
  const bytes = new TextEncoder().encode(word);
  const key = new TextEncoder().encode(SECRET_KEY);
  const xored = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    xored[i] = bytes[i] ^ key[i % key.length];
  }
  return btoa(String.fromCharCode(...xored));
}

function decodeToken(token: string): string | null {
  try {
    const raw = atob(token);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
    const key = new TextEncoder().encode(SECRET_KEY);
    const xored = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
      xored[i] = bytes[i] ^ key[i % key.length];
    }
    const word = new TextDecoder().decode(xored);
    if (!/^[A-Z]{5}$/.test(word)) return null;
    return word;
  } catch {
    return null;
  }
}

function pickWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function evaluateGuess(guess: string, word: string): { letter: string; status: "correct" | "present" | "absent" }[] {
  const result: { letter: string; status: "correct" | "present" | "absent" }[] = [];
  const wordArr = word.split("");
  const guessArr = guess.split("");
  const remaining: (string | null)[] = [...wordArr];

  // First pass: mark correct letters
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === wordArr[i]) {
      result[i] = { letter: guessArr[i], status: "correct" };
      remaining[i] = null;
    }
  }

  // Second pass: mark present/absent
  for (let i = 0; i < 5; i++) {
    if (result[i]) continue;
    const idx = remaining.indexOf(guessArr[i]);
    if (idx !== -1) {
      result[i] = { letter: guessArr[i], status: "present" };
      remaining[idx] = null;
    } else {
      result[i] = { letter: guessArr[i], status: "absent" };
    }
  }

  return result;
}

// Validate guess is 5 alpha characters
function isValidGuess(guess: string): boolean {
  return /^[A-Z]{5}$/.test(guess);
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// --- Routes ---
async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);

  if (req.method === "GET" && url.pathname === "/") {
    return new Response(HTML_PAGE, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  if (req.method === "POST" && url.pathname === "/api/new") {
    const word = pickWord();
    return jsonResponse({ token: encodeToken(word) });
  }

  if (req.method === "POST" && url.pathname === "/api/guess") {
    try {
      const body = await req.json();
      const { token, guess, guessNumber } = body;

      const word = decodeToken(token);
      if (!word) return jsonResponse({ error: "Invalid game token" }, 400);

      const upper = (guess as string).toUpperCase();
      if (!isValidGuess(upper)) {
        return jsonResponse({ error: "Invalid guess. Must be 5 letters." }, 400);
      }
      if (!VALID_GUESSES.has(upper)) {
        return jsonResponse({ error: "Not in word list" }, 400);
      }
      if (typeof guessNumber !== "number" || guessNumber < 1 || guessNumber > 6) {
        return jsonResponse({ error: "Invalid guess number" }, 400);
      }

      const result = evaluateGuess(upper, word);
      const won = upper === word;
      const lost = !won && guessNumber >= 6;
      const status = won ? "won" : lost ? "lost" : "playing";

      const resp: Record<string, unknown> = { result, status, guessNumber };
      if (status !== "playing") resp.answer = word;

      return jsonResponse(resp);
    } catch {
      return jsonResponse({ error: "Invalid request body" }, 400);
    }
  }

  return new Response("Not Found", { status: 404 });
}

// --- HTML Page ---
const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Wordle</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    background: #121213;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100dvh;
    user-select: none;
  }
  header {
    width: 100%;
    max-width: 500px;
    text-align: center;
    padding: 12px 0;
    border-bottom: 1px solid #3a3a3c;
  }
  header h1 { font-size: 2rem; font-weight: 700; letter-spacing: 0.15em; }
  #message {
    height: 32px;
    line-height: 32px;
    font-size: 0.9rem;
    font-weight: 600;
    color: #fff;
    text-align: center;
  }
  #board {
    display: grid;
    grid-template-rows: repeat(6, 1fr);
    gap: 5px;
    padding: 10px 0;
  }
  .row {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 5px;
  }
  .tile {
    width: 62px; height: 62px;
    border: 2px solid #3a3a3c;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: 700;
    text-transform: uppercase;
    transition: transform 0.1s;
  }
  .tile.filled { border-color: #565758; animation: pop 0.1s; }
  .tile.reveal {
    animation: flip 0.35s ease forwards;
  }
  .tile.correct { background: #538d4e; border-color: #538d4e; }
  .tile.present { background: #b59f3b; border-color: #b59f3b; }
  .tile.absent  { background: #3a3a3c; border-color: #3a3a3c; }

  @keyframes pop {
    0% { transform: scale(1); }
    50% { transform: scale(1.12); }
    100% { transform: scale(1); }
  }
  @keyframes flip {
    0%   { transform: rotateX(0); }
    45%  { transform: rotateX(90deg); }
    100% { transform: rotateX(0); }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-4px); }
    40%, 80% { transform: translateX(4px); }
  }
  .row.shake { animation: shake 0.3s; }

  #keyboard {
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding-bottom: 16px;
  }
  .kb-row { display: flex; gap: 5px; }
  .key {
    height: 58px;
    min-width: 36px;
    padding: 0 8px;
    border: none;
    border-radius: 4px;
    background: #818384;
    color: #fff;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    transition: background 0.2s;
  }
  .key.wide { min-width: 65px; font-size: 0.75rem; }
  .key.correct { background: #538d4e; }
  .key.present { background: #b59f3b; }
  .key.absent  { background: #3a3a3c; }

  #new-game {
    display: none;
    margin-top: 12px;
    padding: 12px 32px;
    border: none;
    border-radius: 4px;
    background: #538d4e;
    color: #fff;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.05em;
  }
  #new-game:hover { background: #6aaf5e; }

  @media (max-width: 400px) {
    .tile { width: 52px; height: 52px; font-size: 1.6rem; }
    .key  { height: 50px; min-width: 28px; font-size: 0.75rem; }
    .key.wide { min-width: 52px; }
  }
</style>
</head>
<body>
<header><h1>WORDLE</h1></header>
<div id="message"></div>
<div id="board"></div>
<div id="keyboard"></div>
<button id="new-game">New Game</button>

<script>
const MAX_GUESSES = 6;
const WORD_LENGTH = 5;
let token = null;
let history = [];
let currentRow = 0;
let currentCol = 0;
let currentGuess = "";
let gameOver = false;
let isRevealing = false;

const board = document.getElementById("board");
const messageEl = document.getElementById("message");
const keyboardEl = document.getElementById("keyboard");
const newGameBtn = document.getElementById("new-game");

// Build board
for (let r = 0; r < MAX_GUESSES; r++) {
  const row = document.createElement("div");
  row.className = "row";
  row.dataset.row = r;
  for (let c = 0; c < WORD_LENGTH; c++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.dataset.row = r;
    tile.dataset.col = c;
    row.appendChild(tile);
  }
  board.appendChild(row);
}

// Build keyboard
const rows = [
  ["Q","W","E","R","T","Y","U","I","O","P"],
  ["A","S","D","F","G","H","J","K","L"],
  ["ENTER","Z","X","C","V","B","N","M","BACK"]
];
const keyStatus = {};

rows.forEach(keys => {
  const row = document.createElement("div");
  row.className = "kb-row";
  keys.forEach(k => {
    const btn = document.createElement("button");
    btn.className = "key" + (k.length > 1 ? " wide" : "");
    btn.textContent = k === "BACK" ? "⌫" : k;
    btn.dataset.key = k;
    btn.addEventListener("click", () => handleKey(k));
    row.appendChild(btn);
  });
  keyboardEl.appendChild(row);
});

// Physical keyboard
document.addEventListener("keydown", e => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === "Enter") handleKey("ENTER");
  else if (e.key === "Backspace") handleKey("BACK");
  else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
});

function getTile(row, col) {
  return board.querySelector(\`.tile[data-row="\${row}"][data-col="\${col}"]\`);
}

function showMessage(msg, duration = 1500) {
  messageEl.textContent = msg;
  if (duration > 0) setTimeout(() => { messageEl.textContent = ""; }, duration);
}

function shakeRow(row) {
  const rowEl = board.querySelector(\`.row[data-row="\${row}"]\`);
  rowEl.classList.add("shake");
  rowEl.addEventListener("animationend", () => rowEl.classList.remove("shake"), { once: true });
}

function handleKey(key) {
  if (gameOver || isRevealing) return;

  if (key === "BACK") {
    if (currentCol > 0) {
      currentCol--;
      currentGuess = currentGuess.slice(0, -1);
      const tile = getTile(currentRow, currentCol);
      tile.textContent = "";
      tile.classList.remove("filled");
    }
    return;
  }

  if (key === "ENTER") {
    if (currentGuess.length < WORD_LENGTH) {
      showMessage("Not enough letters");
      shakeRow(currentRow);
      return;
    }
    submitGuess();
    return;
  }

  if (currentCol < WORD_LENGTH) {
    const tile = getTile(currentRow, currentCol);
    tile.textContent = key;
    tile.classList.add("filled");
    currentGuess += key;
    currentCol++;
  }
}

async function submitGuess() {
  isRevealing = true;
  try {
    const res = await fetch("/api/guess", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, guess: currentGuess, guessNumber: currentRow + 1 })
    });
    const data = await res.json();

    if (data.error) {
      showMessage(data.error);
      shakeRow(currentRow);
      isRevealing = false;
      return;
    }

    // Reveal tiles with staggered animation
    const result = data.result;
    const STAGGER = 150;
    const COLOR_DELAY = 160;
    for (let i = 0; i < WORD_LENGTH; i++) {
      const tile = getTile(currentRow, i);
      setTimeout(() => {
        tile.classList.add("reveal");
        setTimeout(() => {
          tile.classList.add(result[i].status);
          updateKeyStatus(result[i].letter, result[i].status);
        }, COLOR_DELAY);
      }, STAGGER * i);
    }

    await delay(STAGGER * (WORD_LENGTH - 1) + COLOR_DELAY + 200);

    history.push({ guess: currentGuess, result });
    currentRow++;
    currentCol = 0;
    currentGuess = "";

    if (data.status === "won") {
      const msgs = ["Genius!", "Magnificent!", "Impressive!", "Splendid!", "Great!", "Phew!"];
      showMessage(msgs[currentRow - 1] || "Nice!", 0);
      gameOver = true;
      newGameBtn.style.display = "block";
    } else if (data.status === "lost") {
      showMessage(data.answer, 0);
      gameOver = true;
      newGameBtn.style.display = "block";
    }

    saveState(data.status, data.answer);
  } catch (err) {
    showMessage("Network error");
  }
  isRevealing = false;
}

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function applyTileInstant(row, col, letter, status) {
  const tile = getTile(row, col);
  tile.textContent = letter;
  tile.classList.add("filled", status);
}

function updateKeyStatus(letter, status) {
  const priority = { correct: 3, present: 2, absent: 1 };
  const prev = keyStatus[letter];
  if (!prev || priority[status] > priority[prev]) {
    keyStatus[letter] = status;
    const keyBtn = keyboardEl.querySelector(\`[data-key="\${letter}"]\`);
    if (keyBtn) keyBtn.className = "key " + status;
  }
}

function saveState(status, answer) {
  localStorage.setItem("wordle_state", JSON.stringify({ token, history, status, answer }));
}

function restoreGame() {
  try {
    const raw = localStorage.getItem("wordle_state");
    if (!raw) return false;
    const state = JSON.parse(raw);
    if (!state.token || !state.history) return false;

    token = state.token;
    history = state.history;
    history.forEach((entry, r) => {
      for (let c = 0; c < WORD_LENGTH; c++) {
        applyTileInstant(r, c, entry.result[c].letter, entry.result[c].status);
        updateKeyStatus(entry.result[c].letter, entry.result[c].status);
      }
    });
    currentRow = history.length;

    if (state.status === "won") {
      const msgs = ["Genius!", "Magnificent!", "Impressive!", "Splendid!", "Great!", "Phew!"];
      showMessage(msgs[currentRow - 1] || "Nice!", 0);
      gameOver = true;
      newGameBtn.style.display = "block";
    } else if (state.status === "lost") {
      showMessage(state.answer, 0);
      gameOver = true;
      newGameBtn.style.display = "block";
    }
    return true;
  } catch {
    return false;
  }
}

function resetBoard() {
  for (let r = 0; r < MAX_GUESSES; r++) {
    for (let c = 0; c < WORD_LENGTH; c++) {
      const tile = getTile(r, c);
      tile.textContent = "";
      tile.className = "tile";
    }
  }
  document.querySelectorAll(".key").forEach(k => {
    if (!k.classList.contains("wide")) k.className = "key";
    else k.className = "key wide";
  });
  Object.keys(keyStatus).forEach(k => delete keyStatus[k]);
  currentRow = 0;
  currentCol = 0;
  currentGuess = "";
  gameOver = false;
  isRevealing = false;
  messageEl.textContent = "";
  newGameBtn.style.display = "none";
}

newGameBtn.addEventListener("click", async () => {
  resetBoard();
  await newGame();
});

async function startGame() {
  if (restoreGame()) return;
  await newGame();
}

async function newGame() {
  const res = await fetch("/api/new", { method: "POST" });
  const data = await res.json();
  token = data.token;
  history = [];
  saveState("playing");
}

startGame();
</script>
</body>
</html>`;

// --- Server ---
console.log("Starting Wordle server...");
const listener = BunnySDK.net.tcp.unstable_new();
console.log("Listening on:", BunnySDK.net.tcp.toString(listener));

BunnySDK.net.http.serve(
  async (req: Request) => {
    console.log(`[INFO]: ${req.method} ${new URL(req.url).pathname}`);
    return handleRequest(req);
  },
);
