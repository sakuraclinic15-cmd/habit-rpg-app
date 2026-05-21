// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Home, Settings, Lock, Wallet, TrendingUp, Calendar, ArrowRight, UserCheck, CheckSquare, Plus, Trash2, Coins, AlertTriangle, Ticket, Award, Edit3, X, HelpCircle } from 'lucide-react';

// --- データ定義 ---
// プレビュー環境で確実に表示するため、絵文字を使ったアバター定義に戻しています
const RANKS = [
  { name: "研修生", exp: 0, avatar: "🔰", msgs: ["今日もよろしく頼むよ。", "ちゃんとやったか？", "遅刻すんなよ。"] },
  { name: "アルバイト", exp: 100, avatar: "🧹", msgs: ["少しは慣れたか？", "今日も頑張ろうぜ。", "時給分は働けよ！"] },
  { name: "契約社員", exp: 300, avatar: "🔧", msgs: ["いつもお疲れ様。", "契約更新目指して頑張れ。", "頼りにしているよ。"] },
  { name: "正社員", exp: 600, avatar: "👔", msgs: ["今日も一日頑張りましょう！", "後輩の指導もよろしくな。", "ボーナス目指してファイト！"] },
  { name: "主任", exp: 1000, avatar: "📋", msgs: ["主任、お疲れ様です！", "現場のまとめ役、頼みますよ。", "今日も的確な指示を！"] },
  { name: "係長", exp: 1500, avatar: "💼", msgs: ["係長、おはようございます！", "今日のタスクも完璧ですね！", "部下たちも係長についていきます！"] },
  { name: "課長", exp: 2500, avatar: "📊", msgs: ["課長、お疲れ様です。", "課の成績トップですね！", "さすが〇〇課長！"] },
  { name: "次長", exp: 4000, avatar: "📁", msgs: ["次長、本日の報告書です。", "部長も次長を頼りにしております。", "素晴らしいマネジメントです。"] },
  { name: "部長", exp: 6000, avatar: "🏢", msgs: ["部長、おはようございます！", "部全体の士気が上がっております！", "さすがの采配です、部長！"] },
  { name: "執行役員", exp: 8500, avatar: "🤝", msgs: ["役員、本日の経営会議の資料です。", "役員のご決断、見事です。", "会社を牽引していただきありがとうございます。"] },
  { name: "取締役", exp: 11000, avatar: "🖋️", msgs: ["取締役、お疲れ様でございます。", "株主からの評価も上々です。", "引き続き経営をお願いいたします。"] },
  { name: "常務", exp: 13000, avatar: "📈", msgs: ["常務、おはようございます。", "現場の士気は最高潮です！", "常務のビジョン、皆が共感しております。"] },
  { name: "専務", exp: 15000, avatar: "💎", msgs: ["専務、お疲れ様でございます。", "社長の右腕として、頼りにされております。", "我が社の未来は専務にかかっております。"] },
  { name: "副社長", exp: 17000, avatar: "👑", msgs: ["副社長、おはようございます。", "次期社長は副社長で決まりですね。", "素晴らしい経営手腕です！"] },
  { name: "社長", exp: 18250, avatar: "🏯", msgs: ["社長、本日の業務報告です！", "素晴らしいご決断です、社長！", "一生ついていきます、社長！"] },
  { name: "会長", exp: 20000, avatar: "🌟", msgs: ["会長、いつも見守っていただきありがとうございます。", "会長の教えは社員に根付いております。", "我が社の永遠 of トップです！"] }
];

const INITIAL_TASKS = [
  { id: 1, name: "朝6時に起きる", reward: 50, done: false },
  { id: 2, name: "宿題を終わらせる", reward: 100, done: false },
  { id: 3, name: "部屋の片付け", reward: 50, done: false },
  { id: 4, name: "10分間読書する", reward: 50, done: false },
];

// 確実な表示とドット絵風の枠組みを持った絵文字アバターコンポーネント
const Avatar = ({ rank, size = "large" }) => {
  const width = size === "large" ? '80px' : '60px';
  const height = size === "large" ? '120px' : '90px';
  const fontSize = size === "large" ? '50px' : '40px';

  return (
    <div 
      className="pixel-border bg-blue-800 rounded flex items-center justify-center flex-shrink-0 shadow-inner"
      style={{ width, height, fontSize }}
    >
      <span style={{ textShadow: '2px 2px 0 #000' }}>{rank.avatar}</span>
    </div>
  );
};

export default function App() {
  // --- States ---
  const [activeTab, setActiveTab] = useState('home');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // アプリのデータステート
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [wallet, setWallet] = useState(0); // 財布（最大3000円）
  const [invest, setInvest] = useState(0); // 投資口座
  const [exp, setExp] = useState(0);
  
  // ログイン関連ステート
  const [consecutiveDays, setConsecutiveDays] = useState(1); // 連続記録（リセットなし）
  const [monthlyLogins, setMonthlyLogins] = useState(1);     // 今月のログイン日数（月初リセット）

  // お助けチケット関連ステート
  const [tickets, setTickets] = useState(1); // タイムリープ（復活）チケット
  const [boostActive, setBoostActive] = useState(false); // 本日報酬1.5倍ブースト状態
  const [boostTickets, setBoostTickets] = useState(1); // ブーストチケット所持数
  
  // UI用ステート
  const [messages, setMessages] = useState([]);
  const [parentUnlocked, setParentUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  
  // 親操作用の入力値
  const [investWithdrawAmount, setInvestWithdrawAmount] = useState('');
  const [investDepositAmount, setInvestDepositAmount] = useState('');
  const [parentTicketAmount, setParentTicketAmount] = useState(1);

  // タスク編集モーダルのステート
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTasks, setEditingTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskReward, setNewTaskReward] = useState(50);

  // ログインポップアップのステート
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loginPopupData, setLoginPopupData] = useState(null);

  // メッセージのユニークID生成用カウンター
  const messageIdRef = useRef(0);

  // 起動時のログイン処理
  useEffect(() => {
    triggerLoginPopup(consecutiveDays, monthlyLogins, 0, false, 'タイムリープ', 0, false);
  }, []);

  // --- Helpers ---
  const addMessage = (text) => {
    const id = `${Date.now()}-${messageIdRef.current++}`;
    setMessages(prev => [...prev, { id, text }]);
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== id));
    }, 4000);
  };

  const triggerLoginPopup = (streak, monthlyCount, rewardAmt = 0, gotTicket = false, ticketType = 'タイムリープ', interest = 0, isHundredBonus = false) => {
    setLoginPopupData({ streak, monthlyCount, rewardAmt, gotTicket, ticketType, interest, isHundredBonus });
    setShowLoginPopup(true);
  };

  const currentRank = [...RANKS].reverse().find(r => exp >= r.exp) || RANKS[0];
  const nextRank = RANKS.find(r => r.exp > exp);
  const progressPercent = nextRank 
    ? Math.min(100, ((exp - currentRank.exp) / (nextRank.exp - currentRank.exp)) * 100)
    : 100;

  const getRandomMsg = () => {
    const msgs = currentRank.msgs;
    return msgs[Math.floor(Math.random() * msgs.length)];
  };

  // お金の追加ロジック（財布3000円超過分は投資へ）
  const addMoney = (amount) => {
    setWallet(prevWallet => {
      let newWallet = prevWallet + amount;
      if (newWallet > 3000) {
        const overflow = newWallet - 3000;
        setInvest(prevInvest => prevInvest + overflow);
        addMessage(`財布が一杯です！超過分 ${overflow}円 を投資口座に回しました。`);
        return 3000;
      }
      return newWallet;
    });
  };

  // タスク完了処理
  const completeTask = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId && !t.done) {
        const finalReward = boostActive ? Math.floor(t.reward * 1.5) : t.reward;
        addMoney(finalReward);
        setExp(prevExp => prevExp + 10);
        addMessage(`[達成] ${t.name} : ${finalReward}円 と 10EXP 獲得！${boostActive ? ' (1.5倍ブースト適用中！)' : ''}`);
        return { ...t, done: true };
      }
      return t;
    }));
  };

  // ログインボーナスの判定
  const checkMonthlyLoginBonus = (dayCount) => {
    let bonusMoney = 0;
    let gotTicket = false;
    let ticketType = '';

    if (dayCount === 5) {
      bonusMoney = 200;
    } else if (dayCount === 10) {
      bonusMoney = 300; gotTicket = true; ticketType = 'タイムリープ'; setTickets(prev => prev + 1);
    } else if (dayCount === 15) {
      bonusMoney = 350;
    } else if (dayCount === 20) {
      bonusMoney = 400; gotTicket = true; ticketType = '報酬ブースト'; setBoostTickets(prev => prev + 1);
    } else if (dayCount === 25) {
      bonusMoney = 500;
    } else if (dayCount === 30) {
      bonusMoney = 600; gotTicket = true; ticketType = 'タイムリープ'; setTickets(prev => prev + 1);
    }

    if (bonusMoney > 0) addMoney(bonusMoney);
    return { bonusMoney, gotTicket, ticketType };
  };

  // 日付を進める
  const advanceDay = (days = 1) => {
    const nextDate = new Date(currentDate);
    const oldMonth = nextDate.getMonth();
    
    nextDate.setDate(nextDate.getDate() + days);
    
    setTasks(prev => prev.map(t => ({ ...t, done: false })));
    setBoostActive(false);
    
    let isMonthChanged = oldMonth !== nextDate.getMonth();
    let nextMonthlyLogins = monthlyLogins;
    let newInterest = 0;

    if (isMonthChanged) {
      nextMonthlyLogins = 1; 
      setMonthlyLogins(1);
      
      if (invest > 0) {
        newInterest = Math.floor(invest * 0.01);
        setInvest(prev => prev + newInterest);
        setTimeout(() => addMessage(`【月初の利息】投資口座に ${newInterest}円 の利息がつきました！`), 1500);
      }
    } else {
      nextMonthlyLogins = monthlyLogins + days;
      setMonthlyLogins(nextMonthlyLogins);
    }

    let nextStreak = days === 1 ? consecutiveDays + 1 : 1;
    setConsecutiveDays(nextStreak);

    const { bonusMoney, gotTicket, ticketType } = checkMonthlyLoginBonus(nextMonthlyLogins);

    let isHundredBonus = false;
    let finalBonusMoney = bonusMoney;

    // 通算連続100日ごとの特別ボーナス
    if (nextStreak > 0 && nextStreak % 100 === 0) {
      isHundredBonus = true;
      finalBonusMoney += 1000;
      addMoney(1000);
      setTickets(prev => prev + 1);
      setBoostTickets(prev => prev + 1);
    }

    setTimeout(() => {
      triggerLoginPopup(nextStreak, nextMonthlyLogins, finalBonusMoney, gotTicket || isHundredBonus, ticketType, newInterest, isHundredBonus);
    }, 600);

    setCurrentDate(nextDate);
  };

  const advanceMonth = () => {
    const nextDate = new Date(currentDate);
    nextDate.setMonth(nextDate.getMonth() + 1);
    nextDate.setDate(1);
    advanceDay(Math.ceil((nextDate - currentDate) / (1000 * 60 * 60 * 24)));
  };

  const openEditModal = () => {
    setEditingTasks([...tasks]);
    setNewTaskName('');
    setIsEditModalOpen(true);
  };

  const saveTasks = () => {
    if (editingTasks.length === 0) {
      addMessage("タスクは最低1個設定してください。");
      return;
    }
    setTasks(editingTasks);
    setIsEditModalOpen(false);
    addMessage("タスクを更新しました！");
  };

  const handleAddTask = () => {
    if (!newTaskName.trim() || editingTasks.length >= 5) return;
    const newId = editingTasks.length > 0 ? Math.max(...editingTasks.map(t => t.id)) + 1 : 1;
    setEditingTasks([...editingTasks, { id: newId, name: newTaskName, reward: newTaskReward, done: false }]);
    setNewTaskName('');
  };

  const handleDeleteTask = (id) => setEditingTasks(editingTasks.filter(t => t.id !== id));

  // --- Views ---
  const renderHome = () => (
    <div className="flex flex-col h-full overflow-y-auto pb-24">
      <div className="bg-blue-900 text-white p-4 pixel-border m-4 shadow-lg">
        <div className="flex items-center gap-4 mb-2">
          {/* 絵文字のアバターを表示 */}
          <Avatar rank={currentRank} size="large" />
          <div className="flex-1">
            <div className="text-sm text-blue-300 mb-1">{currentDate.toLocaleDateString()}</div>
            <div className="text-xl font-bold">{currentRank.name}</div>
            <div className="text-sm flex items-center gap-2">
              <span>累計 EXP: {exp}</span>
              {boostActive && <span className="bg-red-600 text-white text-[10px] px-1 animate-bounce">報酬1.5倍中!</span>}
            </div>
          </div>
        </div>
        
        <div className="bg-black text-white p-3 pixel-border text-sm min-h-[60px] flex items-center relative mt-2">
          <div className="absolute -top-3 left-2 bg-blue-600 px-2 text-xs">System</div>
          <p>「{getRandomMsg()}」</p>
        </div>

        {nextRank && (
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Next: {nextRank.name}</span>
              <span>{nextRank.exp - exp} EXP</span>
            </div>
            <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden pixel-border border-2">
              <div className="bg-yellow-400 h-full" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 mb-4 space-y-2">
        <div className="flex gap-2">
          <div className="flex-1 bg-white p-3 pixel-border shadow-md flex items-center gap-2">
            <Wallet className="text-orange-500" />
            <div>
              <div className="text-xs text-gray-500">お財布 (上限3000)</div>
              <div className="text-lg font-bold">{wallet}円</div>
            </div>
          </div>
          <div className="flex-1 bg-white p-3 pixel-border shadow-md flex items-center gap-2">
            <TrendingUp className="text-blue-500" />
            <div>
              <div className="text-xs text-gray-500">投資口座</div>
              <div className="text-lg font-bold text-blue-700">{invest}円</div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-2.5 pixel-border border-yellow-300 flex justify-around text-sm">
          <div className="flex items-center gap-1.5 font-bold text-yellow-800">
            <Ticket size={18} className="text-yellow-600" />
            <span>復活チケット: {tickets}枚</span>
          </div>
          <div className="border-l border-yellow-300"></div>
          <div className="flex items-center gap-1.5 font-bold text-red-800">
            <Award size={18} className="text-red-600" />
            <span>ブーストチケット: {boostTickets}枚</span>
          </div>
        </div>
      </div>

      <div className="px-4">
        <div className="flex justify-between items-center mb-2 border-b-2 border-gray-300 pb-1">
          <h3 className="text-lg flex items-center gap-2">
            <CheckSquare size={20} /> 本日の業務
          </h3>
          <button onClick={openEditModal} className="text-xs bg-gray-800 text-white px-2 py-1 pixel-border hover:bg-black flex items-center gap-1">
            <Edit3 size={12} /> タスク編集
          </button>
        </div>

        <div className="space-y-3">
          {tasks.map(task => {
            const displayReward = boostActive ? Math.floor(task.reward * 1.5) : task.reward;
            return (
              <button
                key={task.id}
                onClick={() => completeTask(task.id)}
                disabled={task.done}
                className={`w-full text-left p-4 pixel-border shadow-sm flex items-center justify-between transition-all ${
                  task.done ? 'bg-gray-200 opacity-60' : 'bg-white active:bg-blue-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 flex items-center justify-center pixel-border ${task.done ? 'bg-green-500' : 'bg-white'}`}>
                    {task.done && <UserCheck size={16} className="text-white" />}
                  </div>
                  <span className={`text-base ${task.done ? 'line-through text-gray-500' : 'font-bold'}`}>
                    {task.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-orange-600 flex items-center gap-1 justify-end">
                    {boostActive && <span className="text-xs line-through text-gray-400 font-normal">{task.reward}円</span>}
                    <span>{displayReward}円</span>
                  </div>
                  <div className="text-xs text-blue-600">+10 EXP</div>
                </div>
              </button>
            );
          })}
          {tasks.length === 0 && (
            <div className="text-center text-gray-500 py-6 border-2 border-dashed border-gray-300 rounded bg-white">
              タスクが設定されていません。<br/>「タスク編集」から追加してください。
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderParent = () => {
    if (!parentUnlocked) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <Lock size={48} className="text-gray-400 mb-4" />
          <h2 className="text-xl font-bold mb-2">保護者管理システム</h2>
          <p className="text-sm text-gray-600 mb-6">ここから先は親専用の画面です。<br/>出金や投資、チケット給与の設定を行います。</p>
          
          <input 
            type="password" 
            placeholder="PINコード (5454)"
            className="p-3 text-center text-xl tracking-widest pixel-border w-48 mb-2 focus:outline-none"
            value={pinInput}
            onChange={(e) => {
              setPinInput(e.target.value);
              setPinError('');
            }}
          />
          {pinError && <p className="text-red-500 text-sm mb-4">{pinError}</p>}
          
          <button 
            onClick={() => {
              if (pinInput === '1234') { setParentUnlocked(true); setPinInput(''); } 
              else { setPinError('暗証番号が違います'); }
            }}
            className="bg-gray-800 text-white px-8 py-3 pixel-border hover:bg-black w-48"
          >
            ロック解除
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full overflow-y-auto pb-24 p-4">
        <div className="flex justify-between items-center mb-6 border-b-2 border-gray-800 pb-2">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Lock size={20} className="text-red-600" /> 管理メニュー
          </h2>
          <button onClick={() => setParentUnlocked(false)} className="text-sm bg-gray-200 px-3 py-1 pixel-border">
            ロックする
          </button>
        </div>

        <div className="bg-white p-4 pixel-border mb-6 shadow-md border-t-4 border-t-orange-500">
          <h3 className="font-bold mb-2 flex items-center gap-2"><Wallet size={18}/> お小遣いの精算（月初）</h3>
          <p className="text-xs text-gray-600 mb-3">現在の財布の残高を現金として子供に渡し、アプリの財布を0円にリセットします。</p>
          <div className="flex justify-between items-center bg-gray-100 p-3 mb-3">
            <span>現在の財布残高:</span>
            <span className="text-xl font-bold text-orange-600">{wallet} 円</span>
          </div>
          <button 
            onClick={() => { addMessage(`財布から ${wallet}円 を出金しました。`); setWallet(0); }}
            disabled={wallet === 0}
            className={`w-full py-3 pixel-border font-bold ${wallet > 0 ? 'bg-orange-500 text-white active:bg-orange-600' : 'bg-gray-300 text-gray-500'}`}
          >
            {wallet}円 を出金してリセット
          </button>
        </div>

        <div className="bg-white p-4 pixel-border mb-6 shadow-md border-t-4 border-t-blue-500">
          <h3 className="font-bold mb-2 flex items-center gap-2"><TrendingUp size={18}/> 投資口座の管理</h3>
          <div className="flex justify-between items-center bg-gray-100 p-3 mb-4">
            <span>現在の投資残高:</span>
            <span className="text-xl font-bold text-blue-700">{invest} 円</span>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input type="number" placeholder="出金額を入力" className="flex-1 p-2 pixel-border text-right"
                value={investWithdrawAmount} onChange={e => setInvestWithdrawAmount(e.target.value)} />
              <button 
                onClick={() => {
                  const amt = parseInt(investWithdrawAmount);
                  if (amt > 0 && amt <= invest) { setInvest(prev => prev - amt); addMessage(`投資口座から ${amt}円 出金しました。`); setInvestWithdrawAmount(''); } 
                  else { addMessage("正しい金額を入力してください"); }
                }}
                className="bg-gray-800 text-white px-4 py-2 pixel-border whitespace-nowrap"
              >出金する</button>
            </div>

            <div className="flex gap-2">
              <input type="number" placeholder="入金額を入力" className="flex-1 p-2 pixel-border text-right"
                value={investDepositAmount} onChange={e => setInvestDepositAmount(e.target.value)} />
              <button 
                onClick={() => {
                  const amt = parseInt(investDepositAmount);
                  if (amt > 0) { setInvest(prev => prev + amt); addMessage(`投資口座に ${amt}円 入金しました！`); setInvestDepositAmount(''); } 
                  else { addMessage("正しい金額を入力してください"); }
                }}
                className="bg-blue-600 text-white px-4 py-2 pixel-border whitespace-nowrap"
              >入金する</button>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 pixel-border mb-6 shadow-md border-t-4 border-t-yellow-500">
          <h3 className="font-bold mb-2 flex items-center gap-2"><Ticket size={18}/> ご褒美チケットの支給</h3>
          <p className="text-xs text-gray-600 mb-3">ご褒美として親から直接各種チケットをあげることができます。</p>
          
          <div className="flex items-center gap-2 mb-4">
            <label className="text-sm font-bold">枚数:</label>
            <input type="number" min="1" className="p-1.5 pixel-border w-16 text-center"
              value={parentTicketAmount} onChange={e => setParentTicketAmount(Math.max(1, parseInt(e.target.value) || 1))} />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => { setTickets(prev => prev + parentTicketAmount); addMessage(`親から復活チケットを ${parentTicketAmount}枚 もらいました！`); }}
              className="bg-yellow-500 text-white p-2 pixel-border font-bold text-xs"
            >復活チケットを付与</button>
            <button onClick={() => { setBoostTickets(prev => prev + parentTicketAmount); addMessage(`親からブーストチケットを ${parentTicketAmount}枚 もらいました！`); }}
              className="bg-red-500 text-white p-2 pixel-border font-bold text-xs"
            >ブーストを付与</button>
          </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="flex flex-col h-full overflow-y-auto pb-24 p-4">
      <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-300 pb-2 flex items-center gap-2">
        <Settings size={20} /> 設定とお助け
      </h2>

      <div className="bg-yellow-50 p-4 pixel-border mb-6 border-yellow-200">
        <h3 className="font-bold mb-2 flex items-center gap-2 text-yellow-800">
          <Ticket size={18} /> チケットお助けシステム
        </h3>
        
        <div className="bg-white p-3 pixel-border mb-3 border-yellow-300">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-bold text-sm">タイムリープ（連続補填）</h4>
            </div>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 font-bold rounded">消費: 1枚</span>
          </div>
          <button 
            onClick={() => {
              if (tickets >= 1) { setTickets(prev => prev - 1); setConsecutiveDays(prev => prev + 1); addMessage("タイムリープ発動！"); } 
              else { addMessage("復活チケットがありません！"); }
            }}
            className="w-full bg-yellow-500 text-white py-2 pixel-border text-xs font-bold active:bg-yellow-600"
          >タイムリープを使う (所持: {tickets}枚)</button>
        </div>

        <div className="bg-white p-3 pixel-border border-red-300">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-bold text-sm text-red-800">報酬1.5倍ブースト</h4>
            </div>
            <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 font-bold rounded">消費: 1枚</span>
          </div>
          <button 
            onClick={() => {
              if (boostActive) { addMessage("すでに発動しています！"); return; }
              if (boostTickets >= 1) { setBoostTickets(prev => prev - 1); setBoostActive(true); addMessage("報酬1.5倍ブースト発動！"); } 
              else { addMessage("ブーストチケットがありません！"); }
            }}
            disabled={boostActive}
            className={`w-full py-2 pixel-border text-xs font-bold text-white ${boostActive ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 active:bg-red-600'}`}
          >
            {boostActive ? "ブースト適用中" : `ブーストを使う (所持: ${boostTickets}枚)`}
          </button>
        </div>
      </div>
      </div>
    </div>
  );

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=DotGothic16&display=swap');
          .dot-font { font-family: 'DotGothic16', sans-serif; }
          .pixel-border { border: 3px solid #1a202c; box-shadow: 3px 3px 0px #1a202c; border-radius: 4px; }
          .pixel-nav-item { transition: all 0.1s; }
          .pixel-nav-item.active { background-color: #2d3748; color: white; box-shadow: inset 3px 3px 0px rgba(0,0,0,0.5); }
        `}
      </style>

      <div className="max-w-md mx-auto h-screen bg-gray-100 flex flex-col dot-font text-gray-800 relative select-none">
        <header className="bg-gray-800 text-white p-3 flex justify-between items-center shadow-md z-10">
          <h1 className="text-lg font-bold tracking-wider">Habit RPG</h1>
          <div className="flex gap-2 text-xs">
            <div className="bg-black px-2 py-1 rounded pixel-border border-gray-600 border-2">通算連続: {consecutiveDays}日</div>
            <div className="bg-blue-900 px-2 py-1 rounded pixel-border border-blue-700 border-2">今月ログ: {monthlyLogins}日</div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden relative">
          {activeTab === 'home' && renderHome()}
          {activeTab === 'parent' && renderParent()}
          {activeTab === 'settings' && renderSettings()}

          <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center pointer-events-none z-50 px-4 space-y-2">
            {messages.map(m => (
              <div key={m.id} className="bg-black text-white px-4 py-3 rounded text-sm w-full shadow-[0_4px_15px_rgba(0,0,0,0.5)] border-2 border-white animate-pulse pointer-events-auto">
                {m.text}
              </div>
            ))}
          </div>
        </main>

        <nav className="bg-gray-300 border-t-4 border-gray-800 flex absolute bottom-0 w-full h-16 z-20">
          <button onClick={() => setActiveTab('home')} className={`flex-1 flex flex-col items-center justify-center pixel-nav-item ${activeTab === 'home' ? 'active' : ''}`}>
            <Home size={20} className="mb-1" /><span className="text-[10px]">ホーム</span>
          </button>
          <button onClick={() => setActiveTab('parent')} className={`flex-1 flex flex-col items-center justify-center pixel-nav-item ${activeTab === 'parent' ? 'active' : ''}`}>
            <Lock size={20} className="mb-1" /><span className="text-[10px]">親管理</span>
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex-1 flex flex-col items-center justify-center pixel-nav-item ${activeTab === 'settings' ? 'active' : ''}`}>
            <Settings size={20} className="mb-1" /><span className="text-[10px]">設定</span>
          </button>
        </nav>

        {showLoginPopup && loginPopupData && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-6 z-50">
            <div className="bg-blue-900 border-4 border-yellow-400 text-white w-full max-w-sm p-5 pixel-border relative text-center">
              <div className="text-yellow-400 text-2xl font-bold mb-3 animate-bounce">✨ LOGIN BONUSES ✨</div>
              
              {loginPopupData.isHundredBonus && (
                <div className="bg-red-600 text-white p-3 pixel-border font-bold mb-4 border-2 border-yellow-300 animate-pulse">
                  🎊 祝！通算 {loginPopupData.streak} 日達成 🎊<br/>
                  <span className="text-xs">継続の達人！特別ボーナス支給！</span>
                </div>
              )}

              <div className="bg-black/40 p-4 rounded pixel-border border-blue-700 mb-4 space-y-3">
                <div className="text-lg">連続ログイン記録：<span className="text-yellow-400 text-2xl font-bold"> {loginPopupData.streak} </span> 日</div>
                <div className="text-sm text-gray-300 border-t border-blue-800 pt-2">今月のログイン日数：<span className="text-blue-300 font-bold"> {loginPopupData.monthlyCount} </span> 日</div>
              </div>

              {loginPopupData.interest > 0 && (
                <div className="bg-blue-800 text-white p-3 pixel-border mb-4 border-2 border-blue-400">
                  📈 投資口座アップデート
                  <div className="text-xl text-yellow-300 font-bold mt-1">利息 +{loginPopupData.interest} 円 獲得！</div>
                </div>
              )}

              {loginPopupData.rewardAmt > 0 ? (
                <div className="bg-yellow-500 text-black p-3 pixel-border font-bold mb-4">
                  🎉 ボーナス発生！ 🎉
                  <div className="text-xl">お小遣い +{loginPopupData.rewardAmt} 円</div>
                  {loginPopupData.isHundredBonus ? (
                    <div className="text-xs mt-1 text-red-950 font-bold">さらに「復活」「ブースト」チケットを各1枚ゲット！</div>
                  ) : loginPopupData.gotTicket ? (
                    <div className="text-xs mt-1 text-red-950 font-bold">「{loginPopupData.ticketType}チケット」を1枚ゲット！</div>
                  ) : null}
                </div>
              ) : (
                <div className="text-xs text-gray-300 mb-4">次のボーナス：5日ログインで200円<br />（5,10,20,25日にボーナス獲得！）</div>
              )}

              <div className="text-xl mb-4 text-yellow-300 flex flex-col items-center gap-3">
                <Avatar rank={currentRank} size="large" />
                <span>「今日もいい仕事にしよう！」</span>
              </div>

              <button onClick={() => setShowLoginPopup(false)} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-3 pixel-border font-bold text-lg">
                了解（仕事開始）
              </button>
            </div>
          </div>
        )}

        {isEditModalOpen && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-sm p-4 pixel-border flex flex-col max-h-[85vh]">
              <div className="flex justify-between items-center mb-4 border-b-2 border-gray-800 pb-1">
                <h3 className="font-bold text-lg flex items-center gap-1"><Edit3 size={18} /> タスク編集</h3>
                <button onClick={() => setIsEditModalOpen(false)}><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-1">
                {editingTasks.map((t, idx) => (
                  <div key={t.id} className="p-2 border-2 border-gray-800 flex items-center justify-between gap-2 bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">{t.name}</div>
                      <div className="text-xs text-orange-600 font-bold">{t.reward}円 ({t.reward === 100 ? 'ハード' : 'ノーマル'})</div>
                    </div>
                    <button onClick={() => handleDeleteTask(t.id)} className="p-1.5 bg-red-100 text-red-600 pixel-border border-red-300 hover:bg-red-200">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-gray-800 pt-3 space-y-3">
                <div className="text-xs font-bold">新規タスク追加 (最大5個まで)</div>
                <input type="text" placeholder="タスクを入力" className="w-full p-2 pixel-border text-sm focus:outline-none"
                  value={newTaskName} onChange={e => setNewTaskName(e.target.value)} />
                <div className="flex justify-between items-center gap-2">
                  <span className="text-xs font-bold">難易度：</span>
                  <div className="flex gap-1.5">
                    <button type="button" onClick={() => setNewTaskReward(50)} className={`px-3 py-1 text-xs font-bold pixel-border ${newTaskReward === 50 ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}>
                      ノーマル (50円)
                    </button>
                    <button type="button" onClick={() => setNewTaskReward(100)} className={`px-3 py-1 text-xs font-bold pixel-border ${newTaskReward === 100 ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>
                      ハード (100円)
                    </button>
                  </div>
                </div>
                <button onClick={handleAddTask} disabled={editingTasks.length >= 5 || !newTaskName.trim()}
                  className={`w-full py-2.5 pixel-border font-bold text-sm ${editingTasks.length >= 5 || !newTaskName.trim() ? 'bg-gray-300 text-gray-500' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                  リストに追加
                </button>
              </div>

              <div className="border-t-2 border-gray-800 pt-3 mt-4 flex gap-2">
                <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-2 bg-gray-200 pixel-border font-bold text-sm">キャンセル</button>
                <button onClick={saveTasks} className="flex-1 py-2 bg-gray-800 text-white pixel-border font-bold text-sm hover:bg-black">保存する</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
