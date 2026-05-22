```react
// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Home, Settings, Lock, Wallet, TrendingUp, UserCheck, CheckSquare, Trash2, Ticket, Award, Edit3, X, History, Gift } from 'lucide-react';

// --- 100日分の戦士の冒険日誌（台本）の定義 ---
const WARRIOR_DIARY = [
  "今日、ギルドに登録した。俺は最強の戦士になる。まずはスライム退治からだ。剣、重いけど悪くないな。",
  "薬草採取の依頼を受けた。腰が痛い。でも、これで稼いだ銅貨で明日は焼きたてのパンが買えるはずだ。",
  "道端で迷子を保護。護衛して街まで送る。戦うだけが冒険者の仕事じゃないと、古参の戦士に教わった。",
  "ついに魔物と遭遇した！……と思ったらただの小動物。でも、腰の剣に手をかけた時のあの緊張感、忘れない。",
  "初めての魔物討伐依頼。相手はスライム。剣がぬるぬるになったけど、何とか倒せたぞ！ 討伐証明、取った！",
  "スライムと格闘した筋肉痛が酷い。今日は宿で大人しく武器の手入れをする。砥石で研ぐと剣が生き返るんだ。",
  "ギルドで少し強そうなパーティーに誘われた。コボルト討伐だ。足を引っ張らないように気を引き締めないと。",
  "コボルトとの初陣。仲間の背中を守る役割に徹した。最後の一撃は俺が！ ……少しだけ、自信がついたかも。",
  "討伐報酬で新しい革の小手を買った。防具の重要性を身をもって知ったからな。見た目も、少し強そうになったかな？",
  "ランクが上がったとギルド受付嬢に言われた。まだ一番下だけど、看板の名前を見るたび胸が高鳴る。頑張るぞ！",
  "ちょっといい依頼を見つけた。「街道のゴブリン退治」。これなら俺も主力として張れるはずだ。",
  "ゴブリンの癖に罠を使うなんて卑怯だぞ！ 穴に落ちて丸一日無駄にした。お尻が痛い……。",
  "リベンジ成功。でもゴブリンの棍棒で自慢の盾が凹んだ。修理費で報酬が消えて、今日の飯は塩スープ。",
  "ギルドで「若手期待の星」って噂されてるのを聞いちゃった。ニヤニヤが止まらない。もっと褒めて。",
  "調子に乗って少し強い魔物に挑んだら、防具を噛みちぎられて半泣きで逃げ帰った。死ぬかと思った。",
  "昨日の恐怖で足が震える。宿の裏手で、ただひたすらに素振り。基本が一番大事って、本当だな。",
  "ソロは限界があるかも。ギルドの掲示板に「前衛求む！奢りあり」の文字。よし、話を聞いてみよう。",
  "臨時の3人パーティー結成。魔法使いの女の子と、盗賊の男。二人とも年上だけど、頼もしい。",
  "連携ってすげえ！ 俺が引きつけて、魔法でドン！ 1人で苦戦してた魔物が一瞬で消えた。感動だ。",
  "打ち上げで魔法使いの姉さんに「可愛いね」って頭を撫でられた。戦士として見られてない気がする。",
  "臨時パーティーは解散。それぞれの道へ。また寂しい一人旅か……と思ったら、ギルドで変な奴に絡まれた。",
  "絡んできたのは同い年の大剣使い。名前はカイル。「どっちが強いか勝負だ！」って、今忙しいんだけど。",
  "カイルと街の外で決闘。結果は引き分け。あいつ、大振りのくせに強え。泥だらけで大笑いした。",
  "気がついたらカイルと即席コンビを組むことに。依頼は「巨大イノシシの狩猟」。肉、美味そうだな。",
  "イノシシ突進強すぎ！ 二人まとめて吹っ飛ばされて川に落ちた。防具が重くて溺れかけたぞ。",
  "作戦勝ち！ 俺が囮になって、カイルが横から一閃. 仕留めた肉で作ったステーキ、人生で一番美味い！",
  "街に戻ったら、商人から「荷馬車の護衛」を頼まれた。カイルと二人、初めての指名依頼だ。",
  "護衛中、カイルが「腹が減った」とうるさい。お前の胃袋はブラックホールか。俺の干し肉を分ける。",
  "夜襲だ！ 盗賊団が現れたが、今の俺たちなら負けない。カイルと背中を合わせて戦うの、悪くないな。",
  "無事に護衛完了。商人のおっちゃんからボーナスを貰った。カイルと「これで美味いもん食おう」と堅い握手。",
  "ギルドから「近郊の洞窟ダンジョン」の調査依頼が来た。ついに、本当のダンジョンアタックだ！",
  "松明の明かりだけが頼り。暗い、狭い、不気味。カイルの奴、強がってるけど絶対にビビってる。",
  "ダンジョン3日目。毒グモの群れに遭遇。噛まれなくて良かったけど、糸が絡まって身動きが取れん！",
  "洞窟の奥でテントを張って一泊。背中が地面に当たって痛い。早く宿屋のふかふかベッドで寝たい。",
  "迷子になった。右を見ても左を見ても同じ岩肌。カイルの勘を信じたら、完全に行き得どまり。殴るぞ。",
  "地下2階への階段を発見。空気がガラリと変わった。ここから先は、さらに危険なエリアらしい。",
  "罠を踏んだ！ 天井からタライ……じゃなくて、巨大な岩が降ってきた。間一髪で避けたけど寿命が縮んだ。",
  "奥の部屋で、光るチェストを発見！「宝箱だ！」って開けたらミミックだった。指を噛まれて大騒ぎ。",
  "最深部。大きな扉の前にいる。中からものすごい威圧感が伝わってくる。カイル、行くぞ。剣を抜け。",
  "ボス・巨大ゴーレムを撃破！ 剣が折れかけたけど、泥臭く勝った。俺たち、生きてる！ 最高の気分だ！",
  "街へ凱旋！ ギルドのみんなが拍手で迎えてくれた。いやー、それほどでも……って、顔のニヤけが戻らない。",
  "ゴーレムの魔石が高く売れた！ 奮発してカイルと高級酒場へ。ジュースで乾杯だけど、気分は一流だ。",
  "折れかけた剣を新調。馴染みの鍛冶屋の親父に「良い戦い方をしたな」と褒められた。剣が軽いぜ。",
  "昨日買った新品の剣を自慢したくて、街をうろつく。誰か「いい剣だね」って話しかけてくれないかな。",
  "カイルが「お前の奢りで肉を食わせろ」と毎日つきまとってくる。報酬、もう半分くらいカイルの胃袋だぞ。",
  "ギルドの受付嬢さんに「最近調子に乗ってますね」と冷たい目で言われた。ギクッ。す、すいません……。",
  "初心に帰ってひたすら素振り。重い剣を、もっと体の一部みたいに扱えるようになりたい。体幹が大事だな。",
  "カイルと模擬戦。あいつの怪力、前より増してないか？ 防いだだけで腕の骨がきしむ音がしたぞ。",
  "地元の子供たちに「戦士のお兄ちゃん、技見せて！」と囲まれた。かっこよく型を決めたら、派手に転んだ。",
  "ギルドの掲示板に、一枚の挑戦状。……いや、「ギルド内ランクアップ試験」の告知だ。よし、受けるぞ！",
  "試験の条件は「現役の中堅冒険者を一本取ること」。今のままじゃ勝てない。誰かに稽古をつけてもらおう。",
  "酒場で酔っ払っていた元・ベテラン戦士のおっさんをスカウト。一升瓶と引き換えに、稽古をつけてもらう。",
  "おっさんの修行、理不尽すぎる！「滝に向かって叫べ」とか「薪を小指で割れ」とか、これ意味ある！？",
  "今日も筋肉痛でベッドから起き上がれない。全身がミシミシ言う。カイルが笑いながら湿布を貼ってくれた。",
  "おっさんに木刀で挑むも、触れることすらできずにデコピンで気絶させられた。あの人、本当に何者なんだ。",
  "「お前の剣は力みすぎだ」とおっさん。力を抜いて、風を切るように……。あ、今、少しだけ感覚を掴んだかも。",
  "カイルと二人で、おっさんに挑む。二人係でもボコボコにされたけど、前より長く立っていられたぞ。",
  "おっさんが「もう教えることはねえ。酒持ってこい」と。ぶっきらぼうだけど、少し寂しいな。ありがとな。",
  "試験前日。カイルと二人で武器を磨く。明日はお互い別々の相手と戦う。絶対に二人で合格するんだ。",
  "いよいよ試験当日。ギルドの裏の闘技場には、たくさんの見物人が。心臓がうるさい。さあ、行くぞ！",
  "俺の対戦相手は、盾使いのベテラン。鉄壁の防御をどう崩すか……おっさんとの修行を思い出すんだ。",
  "力を抜いて、相手の呼吸を読んで……一閃！ 盾の隙間を突いて、木刀を喉元に突きつけた。勝った、俺の勝ちだ！",
  "カイルも大苦戦の末に勝利。あいつ、最後は剣を放り投げてタックルで勝ってた。戦士というか、野生児だな。",
  "ついにDランクに昇格！ 銀色の新しいギルドプレートが眩しい。これで少しは「一人前」に近づけたか？",
  "Dランクになった途端、受けられる依頼の質が変わった。「隣国国境付近での魔物間引き」。遠征任務だ。",
  "初めて乗る乗合馬車。ガタガタ揺れて、カイルが派手に馬車酔いしている。大剣使いの弱点が乗り物とはな。",
  "国境の村に到着。空気がピリピリしている。街の周りとは、魔物の凶暴さが一段階違う気がするぞ。",
  "国境近くの森で、ウルフの群れと遭遇。動きが速い！ でも、落ち着いて対応すれば、今の俺たちの敵じゃない。",
  "ウルフのボスを撃破。怪我をした村の人を、カイルと肩を貸して村まで運ぶ。感謝されて、心が温かくなった。",
  "遠征終了。村長からお礼に貰った特産の干し肉、めちゃくちゃ美味い。よし、明日はいよいよ街へ帰るぞ！",
  "街に戻ったら、ギルド長直々に指名。新しく見つかった「古代遺跡」の先行調査だって。おいおい、大出世か？",
  "遺跡の入り口に到着。普通の洞窟と違って、壁に見たことない文字が光ってる。カイルが「美味そう」とか言ってる。",
  "遺跡の中は魔法の罠だらけ。歩くたびに火が噴き出したり、床が凍ったり。前髪がちょっと焦げたぞ、危ねえ！",
  "カイルが変なレバーを引いたせいが、部屋の扉が閉まって大量の砂が降ってきた！ 埋まる、二人で必死に掘った。",
  "遺跡4日目。不思議な剣を発見！ 抜こうとしたら、古い魔法の結界に弾き飛ばされて尻もちをついた。痛てて。",
  "遺跡を警備する古代の動く鎧（ガーディアン）と戦闘。剣が効きにくい！ カイルと息を合わせて関節を狙う。",
  "ガーディアンを何とか撃破。壊れた鎧の中から、綺麗な青い宝石が出てきた。これ、高く売れるやつじゃないか？",
  "遺跡の最奥で、巨大な魔法陣を発見。何も起きなかったけど、なんだか不気味だ。調査報告のために紙に記録。",
  "地上への帰り道、カイルが「迷った」と言い出した。行きに目印の傷をつけたらしいが……これ、ただの引っかき傷だろ！",
  "なんとか生還！ ギルド長に報告したら「素晴らしい手際だ」って。貰った報酬で、今日はちょっと良い宿に泊まろう。",
  "遺跡の宝石が高く売れて大儲け. カイルの奴、その金でいきなり高級な大剣を買いやがった。計画性ゼロかよ。",
  "「お前も防具買えよ」って言われたけど、俺は宿代や飯代のために貯金したいんだ。こういうところで意見が合わない。",
  "今日受けた「オーク討伐」の依頼中、カイルが新しい剣を振り回して突っ込みすぎ、囲まれて大ピンチになった。",
  "「無茶しすぎだ！」「新しい剣を試したかっただけだろ！」宿屋でカイルと大喧嘩。あいつの顔、もう見たくない。",
  "今日はカイルを無視して、一人で薬草採取の依頼へ。……なんか、一人だと森がやけに広く感じて落ち着かないな。",
  "ギルドに行ったら、カイルが別の奴らとパーティーを組んでた。べ、別に寂しくなんてないし。フン、勝手にしろ。",
  "カイルが組んだパーティー、評判の悪いガラの悪い奴らだ。あいつ、騙されて危険な依頼に行かされてないか……？",
  "胸騒ぎがして、カイルたちが向かった「這い寄る影の谷」へ走る。あそこはDランクじゃまだ早い危険地帯だぞ！",
  "谷の奥で、案の定仲間に見捨てられて魔物に囲まれるカイルを発見！「バカカイル！」って叫びながら、俺は飛び込んだ。",
  "二人で背中を合わせ、死に物狂いで魔物を撃退。泥だらけのまま「助けにくるのが遅い」「うるせえ」と、笑い合った。",
  "街への帰り道。お互い「悪かった」って、ボソボソ言い訳。でも、これで前よりずっと相棒になれた気がする。",
  "カイルが新しい大剣の使い方を俺に見せてくれた。大振りだけど、俺が隙を埋めれば最強の武器になる。",
  "ギルドの受付嬢さんに「仲直りできて良かったですね」とニヤニヤされた。全部バレてた。恥ずかしすぎる。",
  "二人での連携を再特訓。俺が盾で敵の体勢を崩し、カイルが叩き斬る。阿吽の呼吸って、こういうのを言うんだな。",
  "街の子供に「戦士のお兄ちゃんたち、カッコいい！」と言われた。今度は転ばずに、バシッとポーズを決めたぞ。",
  "地元の名士から「お屋敷の地下ネズミ退治」を頼まれた。ネズミって言っても、こっちのネズミは犬並みにデカい。",
  "地下室でネズミと大乱闘。カイルが驚いて暴れた拍子に、名士の高級なツボを割った。……俺たちの報酬から天引きだ。",
  "ツボの弁償で一文無しに。二人で川原で魚を釣って焼いて食う。でも、カイルと食う魚は、なんだか美味い。",
  "ギルドに、これまでにないデカい羊皮紙の依頼書が張り出された。差出人は……なんと「王国の貴族」。",
  "100日目の節目。その貴族からの依頼は「お嬢様の護衛任務」。ついに俺たちも、上流社会にお呼ばれか！？"
];

// --- 初期タスク定義 ---
const INITIAL_TASKS = [
  { id: 1, name: "anki(英語)", reward: 50, lastCompletedDate: "" },
  { id: 2, name: "数学(AI採点)", reward: 100, lastCompletedDate: "" },
  { id: 3, name: "プリント取込", reward: 50, lastCompletedDate: "" }
];

// --- 日本時間（JST）と100%完全一致する日付（YYYY-MM-DD）を取得（UTCとの時差を完全解消） ---
const getLocalDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const date = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${date}`;
};

// --- 文字列からローカルタイム基準で日付を生成する安全な関数 ---
const parseLocalDate = (dateStr) => {
  if (!dateStr) return new Date();
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  }
  return new Date();
};

// --- 同期的にLocalStorageからデータを読み出す（Stateのラグを完全排除する極上設計） ---
const loadDataFromLocalStorage = () => {
  const saved = localStorage.getItem('warrior_rpg_save');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      return {
        tasks: data.tasks || INITIAL_TASKS,
        wallet: typeof data.wallet === 'number' ? data.wallet : 0,
        invest: typeof data.invest === 'number' ? data.invest : 0,
        exp: typeof data.exp === 'number' ? data.exp : 0,
        level: typeof data.level === 'number' ? data.level : 1,
        cumulativeDays: typeof data.cumulativeDays === 'number' ? data.cumulativeDays : 1,
        monthlyLogins: typeof data.monthlyLogins === 'number' ? data.monthlyLogins : 1,
        treasureTickets: typeof data.treasureTickets === 'number' ? data.treasureTickets : 0,
        lastLoginDate: data.lastLoginDate || getLocalDateString(),
        taskHistory: data.taskHistory || []
      };
    } catch (e) {
      console.error(e);
    }
  }
  return {
    tasks: INITIAL_TASKS,
    wallet: 0,
    invest: 0,
    exp: 0,
    level: 1,
    cumulativeDays: 1,
    monthlyLogins: 1,
    treasureTickets: 0,
    lastLoginDate: getLocalDateString(),
    taskHistory: []
  };
};

// --- 同期的にLocalStorageへ直接書き込む関数 ---
const saveDataToLocalStorage = (data) => {
  localStorage.setItem('warrior_rpg_save', JSON.stringify(data));
};

// --- 戦士ランクの定義 ---
const getWarriorRank = (level) => {
  if (level <= 2) return { name: "Fランク 新米戦士", avatar: "🔰" };
  if (level <= 5) return { name: "Eランク 見習い戦士", avatar: "🧹" };
  if (level <= 9) return { name: "Dランク 駆け出し戦士", avatar: "🗡️" };
  if (level <= 14) return { name: "Cランク 中堅戦士", avatar: "🛡️" };
  if (level <= 19) return { name: "Bランク 精鋭戦士", avatar: "⚔️" };
  if (level <= 29) return { name: "Aランク 豪傑戦士", avatar: "🔥" };
  if (level <= 49) return { name: "Sランク 英雄戦士", avatar: "👑" };
  return { name: "伝説の聖騎士", avatar: "🌟" };
};

const Avatar = ({ avatar, size = "large" }) => {
  const width = size === "large" ? '80px' : '60px';
  const height = size === "large" ? '120px' : '90px';
  const fontSize = size === "large" ? '50px' : '40px';
  return (
    <div className="pixel-border bg-blue-800 rounded flex items-center justify-center flex-shrink-0 shadow-inner" style={{ width, height, fontSize }}>
      <span style={{ textShadow: '2px 2px 0 #000' }}>{avatar}</span>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentDate, setCurrentDate] = useState(getLocalDateString());
  
  // --- 画面表示用のState。初期起動時にLocalStorageから完璧に「同期」して読み出すため、ラグは0 ---
  const [state, setState] = useState(() => loadDataFromLocalStorage());

  // --- UI用のステート（セーブ不要） ---
  const [messages, setMessages] = useState([]);
  const [parentUnlocked, setParentUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [investWithdrawAmount, setInvestWithdrawAmount] = useState('');
  const [investDepositAmount, setInvestDepositAmount] = useState('');
  const [parentTicketAmount, setParentTicketAmount] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTasks, setEditingTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskReward, setNewTaskReward] = useState(50);
  
  // 宝箱ミニゲーム用
  const [showChestGame, setShowChestGame] = useState(false);
  const [chestStates, setChestStates] = useState(['closed', 'closed', 'closed']);
  const [chestResult, setChestResult] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // レベルアップ用
  const [showLevelUpPopup, setShowLevelUpPopup] = useState(false);
  const [levelUpData, setLevelUpData] = useState({ old: 1, next: 2 });

  const messageIdRef = useRef(0);

  // --- 【完全バグ根絶】アプリ起動時（マウント時）に1回だけ確実にログイン日付判定を行う ---
  useEffect(() => {
    const todayStr = getLocalDateString();
    const current = loadDataFromLocalStorage(); // セーブデータから直接同期読み込み

    if (current.lastLoginDate !== todayStr) {
      const today = parseLocalDate(todayStr);
      const lastLogin = parseLocalDate(current.lastLoginDate);
      
      lastLogin.setHours(0,0,0,0);
      today.setHours(0,0,0,0);
      
      const diffDays = Math.round((today - lastLogin) / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        // 翌日になった場合のみ、状態をまとめて更新して保存
        const nextCumulative = current.cumulativeDays + 1;
        let nextMonthly = current.monthlyLogins;
        let nextInvest = current.invest;
        let nextTreasureTickets = current.treasureTickets;
        let newLogs = [];

        const now = new Date();
        const timeStr = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} 00:00`;

        // 月跨ぎの金利判定
        if (today.getMonth() !== lastLogin.getMonth()) {
          nextMonthly = 1;
          if (current.invest > 0) {
            const interest = Math.floor(current.invest * 0.01);
            nextInvest += interest;
            newLogs.push({
              id: Date.now() + Math.random(),
              time: timeStr,
              text: `毎月1日：投資口座に利息(1%)が支給されました`,
              change: `+${interest}円`
            });
          }
        } else {
          nextMonthly += 1;
        }

        // 5日ごとのチケットボーナス
        if (nextCumulative % 5 === 0) {
          nextTreasureTickets += 1;
          newLogs.push({
            id: Date.now() + Math.random() + 2,
            time: timeStr,
            text: `通算ログイン${nextCumulative}日特典「宝箱チケット」獲得`,
            change: `+1枚`
          });
          setTimeout(() => addMessage(`🎁 通算ログイン${nextCumulative}日記念！「宝箱チケット」獲得！`), 800);
        } else {
          setTimeout(() => addMessage(`⚔️ 冒険日誌 ${nextCumulative}日目の朝が来た！`), 800);
        }

        const updated = {
          ...current,
          cumulativeDays: nextCumulative,
          monthlyLogins: nextMonthly,
          invest: nextInvest,
          treasureTickets: nextTreasureTickets,
          lastLoginDate: todayStr,
          taskHistory: [...newLogs, ...current.taskHistory].slice(0, 50)
        };

        saveDataToLocalStorage(updated); // 同期的に直接セーブ！
        setState(updated);               // 画面状態を更新
      }
    }
  }, []);

  // --- Helpers ---
  const addMessage = (text) => {
    const id = `${Date.now()}-${messageIdRef.current++}`;
    setMessages(prev => [...prev, { id, text }]);
    setTimeout(() => setMessages(prev => prev.filter(m => m.id !== id)), 4000);
  };

  const rankInfo = getWarriorRank(state.level);

  // 安全なオーバーフロー合算処理
  const addMoneyAtState = (currentData, amount, overflowLogs) => {
    let nextWallet = currentData.wallet + amount;
    let nextInvest = currentData.invest;
    
    if (nextWallet > 3000) {
      const overflow = nextWallet - 3000;
      nextInvest += overflow;
      nextWallet = 3000;
      
      const now = new Date();
      const timeStr = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      overflowLogs.push({
        id: Date.now() + Math.random() + 5,
        time: timeStr,
        text: `財布上限オーバーのため自動投資振替`,
        change: `+${overflow}円`
      });
      setTimeout(() => addMessage(`財布の上限(3000円)を超えた ${overflow}円 を投資口座へ送りました！`), 200);
    }
    return { wallet: nextWallet, invest: nextInvest };
  };

  // ==========================================
  // 【バグ根絶の要】同期クエスト完了アクション
  // 1. LocalStorageから最新の「真実のデータ」をその場で直接ロード
  // 2. 最終クリア日付を検証し、今日すでに完了していれば即座にブロック
  // 3. 同期的にまとめてLocalStorageへ直接保存（リロード連打によるバグを完全封殺）
  // ==========================================
  const completeTask = (taskId) => {
    const todayStr = getLocalDateString();
    const current = loadDataFromLocalStorage(); // 【真実のロード】Stateのラグを徹底排除
    
    const targetTask = current.tasks.find(t => t.id === taskId);
    if (!targetTask) return;
    
    // すでに今日完了している場合は、絶対に多重実行を許さない！
    if (targetTask.lastCompletedDate === todayStr) {
      console.log("すでに本日完了済みです。");
      return;
    }

    const reward = targetTask.reward;
    const nextExp = current.exp + 10;
    const nextLevel = Math.floor(nextExp / 100) + 1;
    const isLevelUp = nextLevel > current.level;

    let overflowLogs = [];
    let moneyState = addMoneyAtState(current, reward, overflowLogs);
    
    let finalWallet = moneyState.wallet;
    let finalInvest = moneyState.invest;

    // レベルアップ時の自動ボーナス 300円の加算
    if (isLevelUp) {
      const levelUpMoneyState = addMoneyAtState({ wallet: finalWallet, invest: finalInvest }, 300, overflowLogs);
      finalWallet = levelUpMoneyState.wallet;
      finalInvest = levelUpMoneyState.invest;
    }

    const now = new Date();
    const timeStr = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    let newLogs = [
      {
        id: Date.now() + Math.random(),
        time: timeStr,
        text: `クエスト「${targetTask.name}」完了`,
        change: `+${reward}円`
      },
      ...overflowLogs
    ];

    if (isLevelUp) {
      newLogs.unshift({
        id: Date.now() + Math.random() + 1,
        time: timeStr,
        text: `レベルアップ！ Lv.${current.level} ➔ Lv.${nextLevel} 特典ボーナス`,
        change: `+300円`
      });
      
      setLevelUpData({ old: current.level, next: nextLevel });
      setTimeout(() => setShowLevelUpPopup(true), 600);
    }

    addMessage(`[クエスト完了] ${targetTask.name} (+${reward}円 / +10EXP)`);
    if (isLevelUp) {
      addMessage(`🎉 LEVEL UP! Lv.${nextLevel}ボーナス +300円！`);
    }

    // 完了年月日（lastCompletedDate）をタスク自体にロック！
    const updated = {
      ...current,
      tasks: current.tasks.map(t => t.id === taskId ? { ...t, lastCompletedDate: todayStr } : t),
      wallet: finalWallet,
      invest: finalInvest,
      exp: nextExp,
      level: nextLevel,
      taskHistory: [...newLogs, ...current.taskHistory].slice(0, 50)
    };

    saveDataToLocalStorage(updated); // 【真実の直接書き込み】
    setState(updated);               // 最後に画面に反映
  };

  // 宝箱を引く
  const startChestDraw = (index) => {
    if (isDrawing || state.treasureTickets <= 0) return;
    setIsDrawing(true);

    // 1. チケット枚数を減少させて直接書き込み
    const current = loadDataFromLocalStorage();
    const nextTickets = Math.max(0, current.treasureTickets - 1);
    saveDataToLocalStorage({ ...current, treasureTickets: nextTickets });
    setState(prev => ({ ...prev, treasureTickets: nextTickets }));

    const nextStates = [...chestStates];
    nextStates[index] = 'shaking';
    setChestStates(nextStates);

    setTimeout(() => {
      const rand = Math.random();
      let winAmount = 0;
      let textResult = "ハズレ";
      
      if (rand < 0.3333) {
        winAmount = 0;
        textResult = "ハズレ！(ミミックだった...)";
      } else if (rand < 0.6666) {
        winAmount = 100;
        textResult = "100円の小袋！";
      } else {
        winAmount = 500;
        textResult = "500円の財宝！";
      }

      const finalStates = ['closed', 'closed', 'closed'];
      finalStates[index] = 'opened';
      setChestStates(finalStates);
      setChestResult({ amount: winAmount, text: textResult, index });
      
      // 2. 当選金を獲得し同期上書きセーブ
      const postDrawCurrent = loadDataFromLocalStorage();
      let overflowLogs = [];
      const moneyState = addMoneyAtState(postDrawCurrent, winAmount, overflowLogs);
      
      const now = new Date();
      const timeStr = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const updated = {
        ...postDrawCurrent,
        wallet: moneyState.wallet,
        invest: moneyState.invest,
        taskHistory: [
          {
            id: Date.now() + Math.random(),
            time: timeStr,
            text: `宝箱開封：${textResult}`,
            change: winAmount > 0 ? `+${winAmount}円` : "0円"
          },
          ...overflowLogs,
          ...postDrawCurrent.taskHistory
        ].slice(0, 50)
      };

      saveDataToLocalStorage(updated); // 直接同期保存
      setState(updated);
      
      setIsDrawing(false);
    }, 1500);
  };

  const resetChestGame = () => {
    setChestStates(['closed', 'closed', 'closed']);
    setChestResult(null);
    setIsDrawing(false);
    setShowChestGame(false);
  };

  // --- Views ---
  const renderHome = () => {
    const diaryIndex = Math.max(0, state.cumulativeDays - 1);
    const todayDiaryText = WARRIOR_DIARY[diaryIndex] || "最強の戦士としての日常は続く！今日もさらなる高みへ！";
    const currentProgressExp = state.exp % 100;
    const todayStr = getLocalDateString();

    return (
      <div className="flex flex-col h-full overflow-y-auto pb-24 bg-gray-100 text-gray-800">
        {/* 新・上部左右分割のステータスエリア */}
        <div className="bg-slate-900 text-white p-4 pixel-border m-4 shadow-xl border-t-4 border-t-blue-500 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="flex items-start gap-4 relative z-10">
            <div className="flex flex-col items-center w-[90px] flex-shrink-0">
              <Avatar avatar={rankInfo.avatar} size="large" />
              <div className="text-sm font-bold mt-2 text-center w-full bg-slate-800 rounded pixel-border border-slate-700 py-1 shadow-inner text-yellow-400">
                Lv.{state.level}
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-between min-h-[140px]">
              <div className="flex justify-between items-start border-b border-slate-800 pb-1.5">
                <div className="font-bold text-lg text-emerald-400 tracking-wide">{rankInfo.name}</div>
                <div className="text-xs text-blue-300 font-bold self-center bg-blue-950/80 px-2 py-0.5 rounded pixel-border border-blue-900">
                  通算: {state.cumulativeDays}日目
                </div>
              </div>

              <div className="bg-black/60 text-gray-200 p-2.5 pixel-border border-slate-800 text-[12px] flex flex-col relative mt-2 flex-1 shadow-inner leading-relaxed">
                <div className="absolute -top-2 left-2 bg-slate-800 px-1.5 text-[9px] text-yellow-500 font-bold border border-slate-700 rounded uppercase tracking-wider">
                  冒険日誌
                </div>
                <p className="mt-1 font-sans">{todayDiaryText}</p>
              </div>

              <div className="mt-2.5">
                <div className="flex justify-between text-[10px] text-gray-400 font-bold mb-0.5">
                  <span>経験値</span>
                  <span>{currentProgressExp} / 100 EXP</span>
                </div>
                <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden pixel-border border-2 border-slate-800 shadow-inner">
                  <div className="bg-yellow-400 h-full" style={{ width: `${currentProgressExp}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {state.treasureTickets > 0 && (
          <div className="mx-4 mb-3 animate-bounce">
            <button 
              onClick={() => { setChestStates(['closed', 'closed', 'closed']); setChestResult(null); setShowChestGame(true); }}
              className="w-full bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 text-black p-4 pixel-border font-bold flex items-center justify-center gap-3 text-lg shadow-lg hover:brightness-110 active:translate-y-1"
            >
              <Gift className="animate-spin text-red-700 w-6 h-6" />
              <span>宝箱を開けるチケットが {state.treasureTickets} 枚あります！</span>
            </button>
          </div>
        )}

        <div className="px-4 mb-4 space-y-2">
          <div className="flex gap-2">
            <div className="flex-1 bg-white p-4 pixel-border shadow-md flex items-center gap-2">
              <Wallet className="text-orange-500 w-8 h-8" />
              <div>
                <div className="text-[10px] text-gray-500 font-bold">お財布(上限3000)</div>
                <div className="text-xl font-bold text-gray-800">{state.wallet}円</div>
              </div>
            </div>
            <div className="flex-1 bg-white p-4 pixel-border shadow-md flex items-center gap-2">
              <TrendingUp className="text-blue-500 w-8 h-8" />
              <div>
                <div className="text-[10px] text-gray-500 font-bold">投資口座 (月利1%)</div>
                <div className="text-xl font-bold text-blue-700">{state.invest}円</div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4">
          <div className="flex justify-between items-center mb-3 border-b-2 border-gray-300 pb-1">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <CheckSquare size={24} /> 本日のクエスト
            </h3>
            <button 
              onClick={() => { setEditingTasks([...state.tasks]); setNewTaskName(''); setIsEditModalOpen(true); }} 
              className="text-sm bg-gray-800 text-white px-3 py-1.5 pixel-border hover:bg-black flex items-center gap-1 shadow-md"
            >
              <Edit3 size={16} /> クエスト編集
            </button>
          </div>

          <div className="space-y-4 mt-2">
            {state.tasks.map(task => {
              // 今日完了しているかの判定は、タスク自身の lastCompletedDate と今日の日付の一致で行うため絶対にバグりません
              const isDone = task.lastCompletedDate === todayStr;
              
              return (
                <button
                  key={task.id}
                  onClick={() => completeTask(task.id)}
                  disabled={isDone}
                  className={`w-full text-left p-6 pixel-border shadow-md flex items-center justify-between transition-all min-h-[96px] ${isDone ? 'bg-gray-200 opacity-60 cursor-not-allowed' : 'bg-white active:bg-blue-50 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 flex items-center justify-center pixel-border shadow-inner ${isDone ? 'bg-green-500 border-green-700' : 'bg-white'}`}>
                      {isDone && <UserCheck size={32} className="text-white drop-shadow-md" />}
                    </div>
                    <span className={`text-xl ${isDone ? 'line-through text-gray-500 font-normal' : 'font-bold text-gray-800'}`}>
                      {task.name}
                    </span>
                  </div>
                  <div className="text-right flex flex-col justify-center">
                    <div className="text-2xl font-black text-orange-600">
                      {task.reward}円
                    </div>
                    <div className="text-xs text-blue-600 font-bold mt-1">+10 EXP</div>
                  </div>
                </button>
              );
            })}
            {state.tasks.length === 0 && (
              <div className="text-center text-gray-500 py-10 border-4 border-dashed border-gray-300 rounded-lg bg-white text-lg font-bold shadow-sm">
                クエストがありません。<br/>「クエスト編集」から追加してください。
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderParent = () => {
    if (!parentUnlocked) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-gray-100">
          <Lock size={64} className="text-gray-400 mb-6 drop-shadow-md" />
          <h2 className="text-2xl font-bold mb-3 text-gray-800">保護者管理システム</h2>
          <p className="text-base text-gray-600 mb-8">ここから先は上司（親）専用の画面です。<br/>出金、投資、およびタスク完了履歴の確認を行います。</p>
          <input 
            type="password" 
            placeholder="PINコードを入力" 
            className="p-4 text-center text-2xl tracking-widest pixel-border w-64 mb-3 focus:outline-none shadow-inner"
            value={pinInput} 
            onChange={(e) => { setPinInput(e.target.value); setPinError(''); }} 
          />
          {pinError && <p className="text-red-500 text-base font-bold mb-4">{pinError}</p>}
          <button 
            onClick={() => { if (pinInput === '5454') { setParentUnlocked(true); setPinInput(''); } else { setPinError('パスワードが違います'); } }}
            className="bg-gray-800 text-white px-10 py-4 pixel-border font-bold text-lg w-64 shadow-md active:translate-y-1"
          >
            ロック解除
          </button>
        </div>
      );
    }
    return (
      <div className="flex flex-col h-full overflow-y-auto pb-24 p-4 bg-gray-100 text-gray-800">
        <div className="flex justify-between items-center mb-6 border-b-2 border-gray-800 pb-2">
          <h2 className="text-xl font-bold flex items-center gap-2"><Lock size={20} className="text-red-600" /> 保護者メニュー</h2>
          <button onClick={() => setParentUnlocked(false)} className="text-sm bg-gray-200 px-3 py-1 pixel-border font-bold shadow-sm">ロックする</button>
        </div>

        <div className="bg-white p-5 pixel-border mb-6 shadow-md border-t-4 border-t-orange-500">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2"><Wallet size={20}/> お小遣いの現金精算</h3>
          <p className="text-sm text-gray-600 mb-4">お財布に貯まったお小遣いをリアルの現金として渡したら、アプリの財布を0円にリセットします。</p>
          <div className="flex justify-between items-center bg-gray-100 p-4 mb-4 rounded shadow-inner">
            <span className="font-bold">現在の財布残高:</span>
            <span className="text-2xl font-bold text-orange-600">{state.wallet} 円</span>
          </div>
          <button 
            onClick={() => { 
              const refund = state.wallet;
              setState(prev => {
                const now = new Date();
                const timeStr = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                
                const updated = {
                  ...prev,
                  wallet: 0,
                  taskHistory: [{
                    id: Date.now() + Math.random(),
                    time: timeStr,
                    text: `お財布リセット (精算完了)`,
                    change: `-${refund}円`
                  }, ...prev.taskHistory].slice(0, 50)
                };
                saveDataToLocalStorage(updated); // 同期保存
                return updated;
              });
              addMessage(`財布から ${refund}円 を出金しリセットしました。`); 
            }} 
            disabled={state.wallet === 0}
            className={`w-full py-4 pixel-border font-bold text-lg shadow-sm ${state.wallet > 0 ? 'bg-orange-500 text-white active:translate-y-1' : 'bg-gray-300 text-gray-500'}`}
          >
            {state.wallet}円 を支払ってリセット
          </button>
        </div>

        <div className="bg-white p-5 pixel-border mb-6 shadow-md border-t-4 border-t-blue-500">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2"><TrendingUp size={20}/> 投資口座の管理</h3>
          <div className="flex justify-between items-center bg-gray-100 p-4 mb-5 rounded shadow-inner">
            <span className="font-bold">現在の投資残高:</span>
            <span className="text-2xl font-bold text-blue-700">{state.invest} 円</span>
          </div>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input type="number" placeholder="出金額" className="flex-1 p-3 pixel-border text-right text-lg shadow-inner" value={investWithdrawAmount} onChange={e => setInvestWithdrawAmount(e.target.value)} />
              <button 
                onClick={() => { 
                  const amt = parseInt(investWithdrawAmount); 
                  if (amt > 0 && amt <= state.invest) { 
                    setState(prev => {
                      const now = new Date();
                      const timeStr = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                      
                      const updated = {
                        ...prev,
                        invest: prev.invest - amt,
                        taskHistory: [{
                          id: Date.now() + Math.random(),
                          time: timeStr,
                          text: `投資口座から引き出し`,
                          change: `-${amt}円`
                        }, ...prev.taskHistory].slice(0, 50)
                      };
                      saveDataToLocalStorage(updated); // 同期保存
                      return updated;
                    });
                    addMessage(`投資口座から ${amt}円 を引き出しました。`); 
                    setInvestWithdrawAmount(''); 
                  } else { 
                    addMessage("残高が不足しているか、無効な金額です"); 
                  } 
                }}
                className="bg-gray-800 text-white px-5 py-3 pixel-border font-bold shadow-sm active:translate-y-1"
              >
                引き出す
              </button>
            </div>
            <div className="flex gap-2">
              <input type="number" placeholder="入金額" className="flex-1 p-3 pixel-border text-right text-lg shadow-inner" value={investDepositAmount} onChange={e => setInvestDepositAmount(e.target.value)} />
              <button 
                onClick={() => { 
                  const amt = parseInt(investDepositAmount); 
                  if (amt > 0) { 
                    setState(prev => {
                      const now = new Date();
                      const timeStr = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                      
                      const updated = {
                        ...prev,
                        invest: prev.invest + amt,
                        taskHistory: [{
                          id: Date.now() + Math.random(),
                          time: timeStr,
                          text: `投資口座へ手動入金`,
                          change: `+${amt}円`
                        }, ...prev.taskHistory].slice(0, 50)
                      };
                      saveDataToLocalStorage(updated); // 同期保存
                      return updated;
                    });
                    addMessage(`投資口座に ${amt}円 を入金しました。`); 
                    setInvestDepositAmount(''); 
                  } else { 
                    addMessage("正しい金額を入力してください"); 
                  } 
                }}
                className="bg-blue-600 text-white px-5 py-3 pixel-border font-bold shadow-sm active:translate-y-1"
              >
                入金する
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 pixel-border mb-6 shadow-md border-t-4 border-t-yellow-500">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2"><Ticket size={20}/> 宝箱チケットの直接支給</h3>
          <div className="flex items-center gap-3 mb-5">
            <label className="text-base font-bold">支給枚数:</label>
            <input type="number" min="1" className="p-2 pixel-border w-24 text-center text-lg shadow-inner" value={parentTicketAmount} onChange={e => setParentTicketAmount(Math.max(1, parseInt(e.target.value) || 1))} />
          </div>
          <button 
            onClick={() => { 
              setState(prev => {
                const now = new Date();
                const timeStr = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                
                const updated = {
                  ...prev,
                  treasureTickets: prev.treasureTickets + parentTicketAmount,
                  taskHistory: [{
                    id: Date.now() + Math.random(),
                    time: timeStr,
                    text: `親からの宝箱チケット支給`,
                    change: `+${parentTicketAmount}枚`
                  }, ...prev.taskHistory].slice(0, 50)
                };
                saveDataToLocalStorage(updated); // 同期保存
                return updated;
              });
              addMessage(`特別ボーナス！宝箱チケットを ${parentTicketAmount}枚 支給しました！`); 
            }} 
            className="w-full bg-yellow-500 text-black p-4 pixel-border font-bold shadow-sm active:translate-y-1"
          >
            宝箱チケットをプレゼントする
          </button>
        </div>

        <div className="bg-white p-5 pixel-border mb-6 shadow-md border-t-4 border-t-slate-700">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2"><History size={20}/> クエスト実施履歴ログ（直近1ヶ月）</h3>
          <p className="text-xs text-gray-500 mb-3">何月何日何時にどの項目をこなしたかを追跡できます。（バグによる重複受領を完全に監視可能）</p>
          <div className="border-2 border-gray-300 rounded max-h-60 overflow-y-auto divide-y divide-gray-200 bg-gray-50 text-sm">
            {state.taskHistory.length > 0 ? (
              state.taskHistory.map((log) => (
                <div key={log.id} className="p-2.5 flex justify-between items-center bg-white hover:bg-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-bold">{log.time}</span>
                    <span className="font-bold text-gray-800">{log.text}</span>
                  </div>
                  <span className={`text-sm font-black ${log.change.includes('-') ? 'text-red-600' : 'text-emerald-600'}`}>
                    {log.change}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-400 font-bold">履歴はありません。</div>
            )}
          </div>
        </div>

        <div className="bg-red-50 p-4 border-2 border-red-300 rounded">
          <h4 className="text-sm font-bold text-red-800 mb-2">⚠ 危険な操作</h4>
          <button 
            onClick={() => {
              if (window.confirm("すべてのセーブデータをリセットして最初からやり直しますか？")) {
                localStorage.removeItem('warrior_rpg_save');
                window.location.reload();
              }
            }}
            className="bg-red-600 text-white px-4 py-2 text-xs pixel-border font-bold active:bg-red-700"
          >
            データを完全リセット（初期化）
          </button>
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="flex flex-col h-full overflow-y-auto pb-24 p-4 bg-gray-100 text-gray-800">
      <h2 className="text-2xl font-bold mb-5 border-b-2 border-gray-300 pb-2 flex items-center gap-2"><Settings size={24} /> ギルドの遊び方</h2>

      <div className="bg-white p-5 pixel-border mb-6 shadow-sm border-l-4 border-l-yellow-500">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-yellow-800">👑 レベルアップ＆宝箱のルール</h3>
        <ul className="text-sm text-gray-600 list-disc list-inside space-y-2 leading-relaxed">
          <li>クエスト（タスク）を完了すると、お小遣いと一緒に <span className="font-bold text-blue-600">経験値 (EXP)</span> が貯まります。</li>
          <li><span className="font-bold text-yellow-600">100 EXP</span> 貯まるごとにレベルが1アップ！</li>
          <li>レベルアップすると、お祝いボーナスとして <span className="font-bold text-emerald-600">その場で300円</span> が財布に入ります。</li>
          <li>通算ログインが <span className="font-bold text-purple-600">5日増えるごと</span> に「宝箱チケット」がもらえます。</li>
          <li>宝箱からは <span className="font-bold text-red-600">ハズレ（0円）</span> / <span className="font-bold text-indigo-600">100円</span> / <span className="font-bold text-orange-600">500円</span> のいずれかが当たります！</li>
        </ul>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DotGothic16&display=swap');
        .dot-font { font-family: 'DotGothic16', sans-serif; }
        .pixel-border { border: 3px solid #1a202c; box-shadow: 4px 4px 0px #1a202c; border-radius: 4px; }
        .pixel-nav-item { transition: all 0.1s; }
        .pixel-nav-item.active { background-color: #2d3748; color: white; box-shadow: inset 4px 4px 0px rgba(0,0,0,0.5); }
        
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(0px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(2px, 1px) rotate(-1deg); }
          85% { transform: translate(-1px, -1px) rotate(1deg); }
          100% { transform: translate(1px, -2px) rotate(0deg); }
        }
        .chest-shake {
          animation: shake 0.5s infinite;
        }
      `}</style>
      
      <div className="max-w-md mx-auto h-screen bg-gray-100 flex flex-col dot-font text-gray-800 relative select-none shadow-2xl">
        <header className="bg-slate-800 text-white p-4 flex justify-between items-center shadow-md z-10 relative">
          <h1 className="text-xl font-bold tracking-wider text-yellow-400">戦士のハビットRPG</h1>
          <div className="flex gap-3 text-sm">
            <div className="bg-black px-2 py-1.5 rounded pixel-border border-gray-600 border-2 text-yellow-300">通算: {state.cumulativeDays}日</div>
            <div className="bg-blue-900 px-2 py-1.5 rounded pixel-border border-blue-700 border-2">チケット: {state.treasureTickets}枚</div>
          </div>
        </header>

        <div className="absolute top-[80px] left-0 right-0 flex flex-col items-center pointer-events-none z-50 px-4 space-y-2">
          {messages.map(m => (
            <div key={m.id} className="bg-black/95 text-white px-5 py-4 rounded text-base font-bold w-full shadow-[0_4px_15px_rgba(0,0,0,0.5)] border-2 border-yellow-400 animate-pulse pointer-events-auto flex items-center justify-center gap-2">
              <span>{m.text}</span>
            </div>
          ))}
        </div>

        <main className="flex-1 overflow-hidden relative">
          {activeTab === 'home' && renderHome()}
          {activeTab === 'parent' && renderParent()}
          {activeTab === 'settings' && renderSettings()}
        </main>

        <nav className="bg-gray-300 border-t-4 border-gray-800 flex absolute bottom-0 w-full h-20 z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
          <button onClick={() => setActiveTab('home')} className={`flex-1 flex flex-col items-center justify-center pixel-nav-item ${activeTab === 'home' ? 'active' : ''}`}>
            <Home size={28} className="mb-1" /><span className="text-xs font-bold">冒険の部屋</span>
          </button>
          <button onClick={() => setActiveTab('parent')} className={`flex-1 flex flex-col items-center justify-center pixel-nav-item ${activeTab === 'parent' ? 'active' : ''}`}>
            <Lock size={28} className="mb-1" /><span className="text-xs font-bold">親管理（ギルド長）</span>
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex-1 flex flex-col items-center justify-center pixel-nav-item ${activeTab === 'settings' ? 'active' : ''}`}>
            <Settings size={28} className="mb-1" /><span className="text-xs font-bold">遊び方</span>
          </button>
        </nav>

        {showChestGame && (
          <div className="absolute inset-0 bg-black/95 flex items-center justify-center p-6 z-50">
            <div className="bg-slate-900 border-4 border-yellow-400 text-white w-full max-w-sm p-6 pixel-border text-center shadow-2xl relative">
              <button 
                onClick={resetChestGame} 
                disabled={isDrawing}
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
              >
                <X size={28} />
              </button>
              
              <h3 className="text-yellow-400 text-2xl font-bold mb-2 animate-pulse">🎁 ギルド秘蔵の宝箱 🎁</h3>
              <p className="text-xs text-gray-300 mb-6">好きな宝箱を1つ選んでタップしろ！<br/>（中身: 500円 / 100円 / ハズレ 各1/3）</p>

              <div className="grid grid-cols-3 gap-3 mb-6 py-4">
                {[0, 1, 2].map((idx) => {
                  let chestEmoji = "🎁";
                  if (chestStates[idx] === 'opened') {
                    chestEmoji = chestResult?.amount > 0 ? "💎" : "💀";
                  }
                  
                  return (
                    <button
                      key={idx}
                      disabled={isDrawing || chestStates.some(s => s === 'opened' || s === 'shaking')}
                      onClick={() => startChestDraw(idx)}
                      className={`h-24 pixel-border rounded flex flex-col items-center justify-center text-4xl shadow-md transition-all 
                        ${chestStates[idx] === 'shaking' ? 'chest-shake bg-orange-800' : 'bg-slate-800 hover:bg-slate-700'}
                        ${chestStates[idx] === 'opened' ? 'bg-black border-yellow-500' : ''}
                      `}
                    >
                      <span>{chestEmoji}</span>
                      <span className="text-[10px] text-gray-400 mt-1">宝箱 {idx+1}</span>
                    </button>
                  );
                })}
              </div>

              {chestResult && (
                <div className="bg-black/60 p-4 pixel-border border-yellow-400 mb-6">
                  <p className="text-xl font-bold text-yellow-300">{chestResult.text}</p>
                  {chestResult.amount > 0 ? (
                    <p className="text-2xl font-black text-orange-500 mt-1">お小遣い +{chestResult.amount}円 獲得！</p>
                  ) : (
                    <p className="text-sm text-red-400 mt-1">中身はからっぽだった！</p>
                  )}
                </div>
              )}

              <div className="flex gap-2 justify-center">
                <button 
                  onClick={() => { setChestStates(['closed', 'closed', 'closed']); setChestResult(null); }}
                  disabled={isDrawing || state.treasureTickets <= 0}
                  className={`flex-1 py-3.5 pixel-border font-bold text-md ${state.treasureTickets > 0 ? 'bg-yellow-400 text-black hover:bg-yellow-500' : 'bg-gray-600 text-gray-400'}`}
                >
                  もう一回引く (残{state.treasureTickets}枚)
                </button>
                <button 
                  onClick={resetChestGame}
                  disabled={isDrawing}
                  className="px-4 py-3 bg-gray-700 hover:bg-gray-600 pixel-border font-bold text-md text-white"
                >
                  閉じる
                </button>
              </div>
            </div>
          </div>
        )}

        {showLevelUpPopup && (
          <div className="absolute inset-0 bg-black/85 flex items-center justify-center p-6 z-50 animate-fade-in">
            <div className="bg-gradient-to-b from-blue-900 to-indigo-950 border-4 border-yellow-400 text-white w-full max-w-sm p-6 pixel-border text-center shadow-2xl relative">
              <div className="text-yellow-400 text-4xl font-extrabold mb-2 animate-bounce">LEVEL UP!</div>
              <div className="text-xl font-bold mb-4 text-emerald-400">ランクアップ・お祝いボーナス</div>

              <div className="flex justify-center items-center gap-6 py-4 bg-black/40 rounded pixel-border border-slate-800 mb-5">
                <div>
                  <div className="text-[10px] text-gray-400">元ランク</div>
                  <div className="text-lg font-bold text-gray-300">Lv.{levelUpData.old}</div>
                </div>
                <div className="text-2xl text-yellow-400">➔</div>
                <div>
                  <div className="text-[10px] text-yellow-400">新ランク</div>
                  <div className="text-2xl font-black text-yellow-300">Lv.{levelUpData.next}</div>
                </div>
              </div>

              <div className="bg-yellow-500 text-black p-4 pixel-border font-bold mb-6 shadow-md text-lg">
                🎉 レベルアップ報酬 🎉
                <div className="text-2xl font-black text-red-700 mt-1">お小遣い +300円 支給！</div>
              </div>

              <button 
                onClick={() => setShowLevelUpPopup(false)}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-4 pixel-border font-bold text-lg shadow-md active:translate-y-1"
              >
                了解した！（クエストを続ける）
              </button>
            </div>
          </div>
        )}

        {isEditModalOpen && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-sm p-5 pixel-border flex flex-col max-h-[90vh] shadow-2xl">
              <div className="flex justify-between items-center mb-5 border-b-2 border-gray-800 pb-2">
                <h3 className="font-bold text-xl flex items-center gap-2"><Edit3 size={24} /> クエスト編集</h3>
                <button onClick={() => setIsEditModalOpen(false)}><X size={28} /></button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 mb-5 pr-1">
                {editingTasks.map((t) => (
                  <div key={t.id} className="p-3 border-2 border-gray-800 flex items-center justify-between gap-3 bg-gray-50 shadow-sm">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-lg truncate">{t.name}</div>
                      <div className="text-sm text-orange-600 font-bold mt-1">{t.reward}円</div>
                    </div>
                    <button 
                      onClick={() => setEditingTasks(editingTasks.filter(x => x.id !== t.id))} 
                      className="p-2 bg-red-100 text-red-600 pixel-border border-red-300 hover:bg-red-200 active:translate-y-1 shadow-sm"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-gray-800 pt-4 space-y-4">
                <div className="text-sm font-bold">新規クエストの追加 (最大5個)</div>
                <input 
                  type="text" 
                  placeholder="クエスト内容を入力" 
                  className="w-full p-3 pixel-border text-base focus:outline-none shadow-inner" 
                  value={newTaskName} 
                  onChange={e => setNewTaskName(e.target.value)} 
                />
                
                <div className="flex justify-between items-center gap-2">
                  <span className="text-sm font-bold">報酬額：</span>
                  <div className="flex gap-2">
                    <button 
                      type="button" 
                      onClick={() => setNewTaskReward(50)} 
                      className={`px-4 py-2 text-sm font-bold pixel-border shadow-sm ${newTaskReward === 50 ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}
                    >
                      通常 (50円)
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setNewTaskReward(100)} 
                      className={`px-4 py-2 text-sm font-bold pixel-border shadow-sm ${newTaskReward === 100 ? 'bg-red-600 text-white' : 'bg-gray-100'}`}
                    >
                      困難 (100円)
                    </button>
                  </div>
                </div>
                
                <button 
                  onClick={() => { 
                    if(newTaskName.trim() && editingTasks.length < 5) { 
                      setEditingTasks([...editingTasks, { id: Date.now() + Math.random(), name: newTaskName, reward: newTaskReward, lastCompletedDate: "" }]); 
                      setNewTaskName(''); 
                    } 
                  }} 
                  disabled={editingTasks.length >= 5 || !newTaskName.trim()}
                  className={`w-full py-3.5 pixel-border font-bold text-lg shadow-sm ${editingTasks.length >= 5 || !newTaskName.trim() ? 'bg-gray-300 text-gray-500' : 'bg-green-600 text-white active:translate-y-1'}`}
                >
                  クエストを追加
                </button>
              </div>

              {(() => {
                const totalEditingReward = editingTasks.reduce((sum, t) => sum + t.reward, 0);
                const isOverCap = totalEditingReward > 200;
                
                return (
                  <div className="border-t-2 border-gray-800 pt-4 mt-4">
                    <div className="flex justify-between text-sm font-bold mb-3">
                      <span>現在の1日あたり報酬総額:</span>
                      <span className={isOverCap ? 'text-red-600 animate-pulse font-black' : 'text-emerald-600'}>
                        {totalEditingReward}円 / 上限200円
                      </span>
                    </div>

                    {isOverCap && (
                      <div className="bg-red-50 text-red-700 text-xs p-2 pixel-border border-red-300 font-bold mb-3">
                        ⚠ 1日の報酬上限が200円を超えています。難易度を調整するか、タスクを減らしてください。
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 bg-gray-200 pixel-border font-bold text-lg shadow-sm active:translate-y-1">キャンセル</button>
                      <button 
                        onClick={() => { 
                          if (!isOverCap) {
                            setState(prev => {
                              const updated = {
                                ...prev,
                                tasks: editingTasks
                              };
                              saveDataToLocalStorage(updated); // 同期保存
                              return updated;
                            });
                            setIsEditModalOpen(false); 
                            addMessage("クエストを更新しました！"); 
                          }
                        }} 
                        disabled={isOverCap}
                        className={`flex-1 py-3 pixel-border font-bold text-lg shadow-sm ${isOverCap ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-gray-800 text-white active:translate-y-1'}`}
                      >
                        保存する
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

```
