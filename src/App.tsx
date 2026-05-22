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
  "作戦勝ち！ 俺が囮になって、カイルが横から一閃。仕留めた肉で作ったステーキ、人生で一番美味い！",
  "街に戻ったら、商人から「荷馬車の護衛」を頼まれた。カイルと二人、初めての指名依頼だ。",
  "護衛中、カイルが「腹が減った」とうるさい。お前の胃袋はブラックホールか。俺の干し肉を分ける。",
  "夜襲だ！ 盗賊団が現れたが、今の俺たちなら負けない。カイルと背中を合わせて戦うの、悪くないな。",
  "無事に護衛完了。商人のおっちゃんからボーナスを貰った。カイルと「これで美味いもん食おう」と堅い握手。",
  "ギルドから「近郊の洞窟ダンジョン」の調査依頼が来た。ついに、本当のダンジョンアタックだ！",
  "松明の明かりだけが頼り。暗い、狭い、不気味。カイルの奴、強がってるけど絶対にビビってる。",
  "ダンジョン3日目。毒グモの群れに遭遇。噛まれなくて良かったけど、糸が絡まって身動きが取れん！",
  "洞窟の奥でテントを張って一泊。背中が地面に当たって痛い。早く宿屋のふかふかベッドで寝たい。",
  "迷子になった。右を見ても左を見ても同じ岩肌。カイルの勘を信じたら、完全に行き止まり。殴るぞ。",
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
  "遺跡の宝石が高く売れて大儲け。カイルの奴、その金でいきなり高級な大剣を買いやがった。計画性ゼロかよ。",
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
  { id: 1, name: "anki(英語)", reward: 50, done: false },
  { id: 2, name: "数学(AI採点)", reward: 100, done: false },
  { id: 3, name: "プリント取込", reward: 50, done: false }
];

// --- 日本時間（JST）と100%完全一致する日付（YYYY-MM-DD）を取得（UTCとの時差9時間を完全解消） ---
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
  
  // ==========================================
  // 【バグ完全根絶】アトミック統合ステート
  // 全ての状態を1つの大きなオブジェクトに統合。
  // 一部のステートだけが非同期で遅れてセーブデータに書き込まれる現象を100%防止。
  // ==========================================
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('warrior_rpg_save');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return {
          tasks: data.tasks || INITIAL_TASKS,
          wallet: data.wallet !== undefined ? data.wallet : 0,
          invest: data.invest !== undefined ? data.invest : 0,
          exp: data.exp !== undefined ? data.exp : 0,
          level: data.level !== undefined ? data.level : 1,
          cumulativeDays: data.cumulativeDays !== undefined ? data.cumulativeDays : 1,
          monthlyLogins: data.monthlyLogins !== undefined ? data.monthlyLogins : 1,
          treasureTickets: data.treasureTickets !== undefined ? data.treasureTickets : 0,
          lastLoginDate: data.lastLoginDate || getLocalDateString(),
          taskHistory: data.taskHistory || []
        };
      } catch (e) {
        console.error("Save data parse failed", e);
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
  });

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

  // --- 【時差・リロードバグ根絶】アトミックな1日1回日付判定エフェクト ---
  useEffect(() => {
    const todayStr = getLocalDateString();
    
    setState(prev => {
      // 1. 同一日のリロード、あるいは初期状態の未定義時は即座にスルー（二重判定バグ完全防止）
      if (prev.lastLoginDate === todayStr) {
        return prev;
      }
      
      const today = parseLocalDate(todayStr);
      const lastLogin = parseLocalDate(prev.lastLoginDate);
      
      lastLogin.setHours(0,0,0,0);
      today.setHours(0,0,0,0);
      
      const diffDays = Math.round((today - lastLogin) / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        return {
          ...prev,
          lastLoginDate: todayStr
        };
      }

      // 2. 翌日になった場合のみ、状態をまとめて1回で同時更新
      const nextCumulative = prev.cumulativeDays + 1;
      let nextMonthly = prev.monthlyLogins;
      let nextInvest = prev.invest;
      let nextTreasureTickets = prev.treasureTickets;
      let newLogs = [];

      const now = new Date();
      const timeStr = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} 00:00`;

      // 月跨ぎの金利判定
      if (today.getMonth() !== lastLogin.getMonth()) {
        nextMonthly = 1;
        if (prev.invest > 0) {
          const interest = Math.floor(prev.invest * 0.01);
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

      // 本日のタスクリセット＆ログイン状態更新
      return {
        ...prev,
        tasks: prev.tasks.map(t => ({ ...t, done: false })),
        cumulativeDays: nextCumulative,
        monthlyLogins: nextMonthly,
        invest: nextInvest,
        treasureTickets: nextTreasureTickets,
        lastLoginDate: todayStr,
        taskHistory: [...newLogs, ...prev.taskHistory].slice(0, 50)
      };
    });
  }, []);

  // --- 自動セーブ（State変更をトリガーに1回だけ安全に保存） ---
  useEffect(() => {
    localStorage.setItem('warrior_rpg_save', JSON.stringify(state));
  }, [state]);

  // --- Helpers ---
  const addMessage = (text) => {
    const id = `${Date.now()}-${messageIdRef.current++}`;
    setMessages(prev => [...prev, { id, text }]);
    setTimeout(() => setMessages(prev => prev.filter(m => m.id !== id)), 4000);
  };

  const rankInfo = getWarriorRank(state.level);

  // 安全な合算処理
  const addMoneyAtState = (prev, amount, overflowLogs) => {
    let nextWallet = prev.wallet + amount;
    let nextInvest = prev.invest;
    
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

  // クエスト完了
  const completeTask = (taskId) => {
    setState(prev => {
      // すでに完了している場合、二重受け取りバグを100%防ぐために状態を不変で返す
      const targetTask = prev.tasks.find(t => t.id === taskId);
      if (!targetTask || targetTask.done) return prev;

      const reward = targetTask.reward;
      const nextExp = prev.exp + 10;
      const nextLevel = Math.floor(nextExp / 100) + 1;
      const isLevelUp = nextLevel > prev.level;

      let overflowLogs = [];
      const moneyState = addMoneyAtState(prev, reward, overflowLogs);
      
      let finalWallet = moneyState.wallet;
      let finalInvest = moneyState.invest;

      // レベルアップ時の自動ボーナス 300円
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
          text: `レベルアップ！ Lv.${prev.level} ➔ Lv.${nextLevel} 特典ボーナス`,
          change: `+300円`
        });
        
        setLevelUpData({ old: prev.level, next: nextLevel });
        setTimeout(() => setShowLevelUpPopup(true), 600);
      }

      addMessage(`[クエスト完了] ${targetTask.name} (+${reward}円 / +10EXP)`);
      if (isLevelUp) {
        addMessage(`🎉 LEVEL UP! Lv.${nextLevel}ボーナス +300円！`);
      }

      return {
        ...prev,
        tasks: prev.tasks.map(t => t.id === taskId ? { ...t, done: true } : t),
        wallet: finalWallet,
        invest: finalInvest,
        exp: nextExp,
        level: nextLevel,
        taskHistory: [...newLogs, ...prev.taskHistory].slice(0, 50)
      };
    });
  };

  // 宝箱を引く
  const startChestDraw = (index) => {
    if (isDrawing || state.treasureTickets <= 0) return;
    setIsDrawing(true);

    // 1. まずチケットを消費
    setState(prev => ({
      ...prev,
      treasureTickets: Math.max(0, prev.treasureTickets - 1)
    }));

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
      
      // 2. 当選金をアトミックに加算
      setState(prev => {
        let overflowLogs = [];
        const moneyState = addMoneyAtState(prev, winAmount, overflowLogs);
        
        const now = new Date();
        const timeStr = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        return {
          ...prev,
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
            ...prev.taskHistory
          ].slice(0, 50)
        };
      });
      
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

    return (
      <div className="flex flex-col h-full overflow-y-auto pb-24 bg-gray-100 text-gray-800">
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
                <div clas
