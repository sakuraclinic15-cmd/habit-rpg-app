```react
import React, { useState, useEffect, useRef } from 'react';
import { Home, Settings, Lock, Wallet, TrendingUp, UserCheck, CheckSquare, Trash2, Ticket, Award, Edit3, X, History, Gift } from 'lucide-react';

// --- 型定義 (TypeScript) ---
interface Task {
  id: number;
  name: string;
  reward: number;
}

interface HistoryLog {
  id: number;
  time: string;
  text: string;
  change: string;
}

interface AppState {
  tasks: Task[];
  wallet: number;
  invest: number;
  exp: number;
  level: number;
  treasureTickets: number;
  loginDates: string[];
  completedTasksLog: string[];
  taskHistory: HistoryLog[];
}

interface AvatarProps {
  avatar: string;
  size?: 'large' | 'small';
}

interface RankInfo {
  name: string;
  avatar: string;
}

// --- 100日分の戦士の冒険日誌（台本）の定義 ---
const WARRIOR_DIARY: string[] = [
  "今日、ギルドに登録した。俺は最強の戦士になる。まずはスライム退治からだ。剣、重いけど悪くないな。",
  "薬草採取の依頼を受けた。腰が痛い。でも、これで稼いだ銅貨で明日は焼きたてのパンが買えるはずだ。",
  "道端で迷子を保護。護衛して街まで送る。戦うだけが冒険者の仕事じゃないと、古参の戦士に教わった。",
  "ついに魔物と遭遇した！……と思ったらただの小動物。でも、腰の剣に手をかけた時のあの緊張感、忘れない。",
  "初めての魔物討伐依頼。相手はスライム。剣がぬるぬるになったけど、何とか倒せたぞ！ 討伐証明、取った！",
  "スライムと格闘した筋肉痛が酷い。今日は宿で大人しく武器の手入れをする。砥石で研ぐと剣が生き返るんだ。",
  "ギルドで少し強そうなパーティーに誘われた。コボルト討伐だ。足を引っ張らないように気を引き締めないと。",
  "コボルトとの初陣。仲間の背中を守る役割に徹した. 最後の一撃は俺が！ ……少しだけ、自信がついたかも。",
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
  "「お前の剣は力みすぎだ」とおっさん。力を抜いて、風を切るように……。あ、今、少し感覚を掴んだかも。",
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
const INITIAL_TASKS: Task[] = [
  { id: 1, name: "anki(英語)", reward: 50 },
  { id: 2, name: "数学(AI採点)", reward: 100 },
  { id: 3, name: "プリント取込", reward: 50 }
];

// --- 日本時間（JST）と100%完全一致する日付（YYYY-MM-DD）を取得（時差バグ完全解消） ---
const getLocalDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const date = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${date}`;
};

// --- 文字列からローカルタイム基準で日付を生成する安全な関数 ---
const parseLocalDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();
  const parts = dateStr.split('-');
  return parts.length === 3 ? new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10)) : new Date();
};

// ==========================================
// 【バグ根絶・データ自動修復＆逆算設計】
// 1. スマホの記憶から最新データを直接同期ロード。
// 2. 過去の全ての形式のゴミをお掃除し、TypeScriptに完全にマッピング。
// 3. 【ユーザー様ご提案】「完了履歴ログ」から正しい財布残高を完全に逆算して減算修正する。
// ==========================================
const loadDataFromLocalStorage = (): AppState => {
  if (typeof window === 'undefined') {
    return { tasks: INITIAL_TASKS, wallet: 0, invest: 0, exp: 0, level: 1, treasureTickets: 0, loginDates: [getLocalDateString()], completedTasksLog: [], taskHistory: [] };
  }

  const saved = localStorage.getItem('warrior_rpg_save');
  const todayStr = getLocalDateString();
  
  if (saved) {
    try {
      const data = JSON.parse(saved);
      
      const rawTasks = Array.isArray(data.tasks) ? data.tasks : INITIAL_TASKS;
      const loadedLog: string[] = Array.isArray(data.completedTasksLog) ? data.completedTasksLog : [];
      const repairedLog = [...loadedLog];

      // 【ゴミの自動修復】過去の完了フラグ(done)の残骸があれば新形式スタンプに自動コンバート
      rawTasks.forEach((t: any) => {
        if (t && t.done && t.name) {
          const legacyKey = `${todayStr}_${t.name}`;
          if (!repairedLog.includes(legacyKey)) {
            repairedLog.push(legacyKey);
          }
        }
      });

      // クエストデータそのものからは不整合の引き金になるdoneフラグを完全に消去
      const cleanTasks: Task[] = rawTasks.map((t: any) => ({
        id: typeof t.id === 'number' ? t.id : Math.random(),
        name: typeof t.name === 'string' ? t.name : "",
        reward: typeof t.reward === 'number' ? t.reward : 50
      }));

      // 【データお掃除】歴史ログ(taskHistory)の中に混ざっている古い文字列形式のログを、完全にオブジェクト形式へクレンジング
      const rawHistory = Array.isArray(data.taskHistory) ? data.taskHistory : [];
      const cleanHistory: HistoryLog[] = rawHistory.map((h: any) => {
        if (typeof h === 'string') {
          return {
            id: Math.random(),
            time: todayStr,
            text: h,
            change: ""
          };
        }
        if (h && typeof h === 'object') {
          return {
            id: typeof h.id === 'number' ? h.id : Math.random(),
            time: typeof h.time === 'string' ? h.time : todayStr,
            text: typeof h.text === 'string' ? h.text : "",
            change: typeof h.change === 'string' ? h.change : ""
          };
        }
        return { id: Math.random(), time: todayStr, text: "", change: "" };
      });

      // --- 【ユーザー様直伝の逆算設計】履歴ログを基準にしたお小遣い強制算出 ---
      let calculatedWallet = 0;
      let calculatedInvest = typeof data.invest === 'number' ? data.invest : 0;

      // A. スタンプ帳（全クエスト完了ログ）を完全に走査して、本来稼いでいるべき金額を足し算
      repairedLog.forEach(logKey => {
        const parts = logKey.split('_');
        if (parts.length >= 2) {
          const tName = parts.slice(1).join('_');
          const matchedTask = cleanTasks.find(t => t.name === tName) || INITIAL_TASKS.find(t => t.name === tName);
          if (matchedTask) {
            calculatedWallet += matchedTask.reward;
          }
        }
      });

      // B. レベル履歴からボーナス分（1レベルごとに300円）を算出
      const currentLevel = typeof data.level === 'number' ? data.level : 1;
      if (currentLevel > 1) {
        calculatedWallet += (currentLevel - 1) * 300;
      }

      // C. 宝箱獲得、お小遣いリセット清算（引き算）をシステム履歴ログから読み取って合算
      cleanHistory.forEach(h => {
        if (h.text.includes("宝箱を開けた") && h.change.includes("円") && !h.change.includes("-")) {
          const moneyNum = parseInt(h.change.replace(/[^0-9]/g, ""), 10);
          if (!isNaN(moneyNum)) calculatedWallet += moneyNum;
        }
        if (h.text.includes("お財布リセット") && h.change.includes("-")) {
          const refundNum = parseInt(h.change.replace(/[^0-9]/g, ""), 10);
          if (!isNaN(refundNum)) calculatedWallet -= refundNum;
        }
      });

      // D. 財布上限（3000円）の超過オーバーフロー自動計算
      if (calculatedWallet > 3000) {
        const overflow = calculatedWallet - 3000;
        calculatedInvest += overflow;
        calculatedWallet = 3000;
      }
      if (calculatedWallet < 0) calculatedWallet = 0;

      return {
        tasks: cleanTasks,
        wallet: calculatedWallet, // 完璧に逆算され、必要があれば減算修正された本物の残高
        invest: calculatedInvest,
        exp: typeof data.exp === 'number' ? data.exp : 0,
        level: currentLevel,
        treasureTickets: typeof data.treasureTickets === 'number' ? data.treasureTickets : 0,
        loginDates: Array.isArray(data.loginDates) ? data.loginDates : [todayStr],
        completedTasksLog: repairedLog,
        taskHistory: cleanHistory
      };
    } catch (e) {
      console.error("データの破損を検知したため、安全に修復初期化しました", e);
    }
  }
  
  return {
    tasks: INITIAL_TASKS,
    wallet: 0,
    invest: 0,
    exp: 0,
    level: 1,
    treasureTickets: 0,
    loginDates: [todayStr],
    completedTasksLog: [],
    taskHistory: []
  };
};

const saveDataToLocalStorage = (data: AppState): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('warrior_rpg_save', JSON.stringify(data));
  }
};

const getWarriorRank = (level: number): RankInfo => {
  if (level <= 2) return { name: "Fランク 新米戦士", avatar: "🔰" };
  if (level <= 5) return { name: "Eランク 見習い戦士", avatar: "🧹" };
  if (level <= 9) return { name: "Dランク 駆け出し戦士", avatar: "🗡️" };
  if (level <= 14) return { name: "Cランク 中堅戦士", avatar: "🛡️" };
  if (level <= 19) return { name: "Bランク 精鋭戦士", avatar: "⚔️" };
  if (level <= 29) return { name: "Aランク 豪傑戦士", avatar: "🔥" };
  if (level <= 49) return { name: "Sランク 英雄戦士", avatar: "👑" };
  return { name: "伝説の聖騎士", avatar: "🌟" };
};

const Avatar: React.FC<AvatarProps> = ({ avatar, size = "large" }) => {
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
  const [activeTab, setActiveTab] = useState<string>('home');
  const [currentDate, setCurrentDate] = useState<string>(getLocalDateString());
  
  // --- 画面表示用のState。初期起動時にお掃除済みのデータを同期的に完全ロードするためラグは皆無 ---
  const [state, setState] = useState<AppState>(() => loadDataFromLocalStorage());

  // --- UI用のステート（セーブ不要） ---
  const [messages, setMessages] = useState<{ id: string; text: string }[]>([]);
  const [parentUnlocked, setParentUnlocked] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [investWithdrawAmount, setInvestWithdrawAmount] = useState<string>('');
  const [investDepositAmount, setInvestDepositAmount] = useState<string>('');
  const [parentTicketAmount, setParentTicketAmount] = useState<number>(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingTasks, setEditingTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState<string>('');
  const [newTaskReward, setNewTaskReward] = useState<number>(50);
  
  // 宝箱ミニゲーム用
  const [showChestGame, setShowChestGame] = useState<boolean>(false);
  const [chestStates, setChestStates] = useState<string[]>(['closed', 'closed', 'closed']);
  const [chestResult, setChestResult] = useState<{ amount: number; text: string; index: number } | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  // レベルアップ用
  const [showLevelUpPopup, setShowLevelUpPopup] = useState<boolean>(false);
  const [levelUpData, setLevelUpData] = useState<{ old: number; next: number }>({ old: 1, next: 2 });

  const messageIdRef = useRef<number>(0);

  // --- 【時差・リロードバグ根絶】ログイン日付判定 ---
  useEffect(() => {
    const todayStr = getLocalDateString();
    const current = loadDataFromLocalStorage(); // セーブデータから直接同期読み込み

    if (!current.loginDates.includes(todayStr)) {
      const updatedDates = [...current.loginDates, todayStr];
      const nextCumulative = updatedDates.length; // ログインした実質的な日付の数が通算日数
      
      let nextInvest = current.invest;
      let nextTreasureTickets = current.treasureTickets;
      let newLogs: HistoryLog[] = [];

      const now = new Date();
      const timeStr = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} 00:00`;

      // 月跨ぎ判定
      const lastLoginDateStr = current.loginDates[current.loginDates.length - 1];
      if (lastLoginDateStr) {
        const lastLogin = parseLocalDate(lastLoginDateStr);
        const today = parseLocalDate(todayStr);
        if (today.getMonth() !== lastLogin.getMonth()) {
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
        }
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

      const updated: AppState = {
        ...current,
        loginDates: updatedDates,
        invest: nextInvest,
        treasureTickets: nextTreasureTickets,
        taskHistory: [...newLogs, ...current.taskHistory].slice(0, 50)
      };

      saveDataToLocalStorage(updated); // 同期的に直接セーブ
      setState(updated);               // 画面状態の同期
    }
  }, []);

  const addMessage = (text: string): void => {
    const id = `${Date.now()}-${messageIdRef.current++}`;
    setMessages(prev => [...prev, { id, text }]);
    setTimeout(() => setMessages(prev => prev.filter(m => m.id !== id)), 4000);
  };

  const rankInfo = getWarriorRank(state.level);

  // 安全なオーバーフロー合算処理
  const addMoneyAtState = (currentData: AppState, amount: number, overflowLogs: HistoryLog[]) => {
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
  // 【ユーザー様発案：完了スタンプ照合ガード】
  // ==========================================
  const completeTask = (taskId: number): void => {
    const todayStr = getLocalDateString();
    const current = loadDataFromLocalStorage(); // 【真実の直接ロード】Stateの非同期ラグを100%封鎖
    
    const targetTask = current.tasks.find(t => t.id === taskId);
    if (!targetTask) return;
    
    const completedKey = `${todayStr}_${targetTask.name}`;
    
    // 【ユーザー様直伝の防壁】すでに今日このタスクの完了ログが存在する場合、絶対に100%すべての処理を遮断！
    if (current.completedTasksLog.includes(completedKey)) {
      addMessage(`[防衛システム] 「${targetTask.name}」は本日すでに完了しています。`);
      return;
    }

    const reward = targetTask.reward;
    const nextExp = current.exp + 10;
    const nextLevel = Math.floor(nextExp / 100) + 1;
    const isLevelUp = nextLevel > current.level;

    // 今回獲得したログスタンプを配列に追加（これでお財布の計算大元が完全にロックされます）
    const updatedLog = [...current.completedTasksLog, completedKey];

    const now = new Date();
    const timeStr = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    let newLogs: HistoryLog[] = [
      {
        id: Date.now() + Math.random(),
        time: timeStr,
        text: `クエスト「${targetTask.name}」完了`,
        change: `+${reward}円`
      }
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

    // 更新用のベースオブジェクトを作成
    const preUpdatedObj: App
