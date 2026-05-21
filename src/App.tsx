// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Home, Settings, Lock, Wallet, TrendingUp, UserCheck, CheckSquare, Trash2, Ticket, Award, Edit3, X } from 'lucide-react';

// --- データ定義 ---
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
  { name: "会長", exp: 20000, avatar: "🌟", msgs: ["会長、いつも見守っていただきありがとうございます。", "会長の教えは社員に根付いております。", "我が社の永遠のトップです！"] }
];

const INITIAL_TASKS = [
  { id: 1, name: "朝6時に起きる", reward: 50, done: false },
  { id: 2, name: "宿題を終わらせる", reward: 100, done: false },
  { id: 3, name: "部屋の片付け", reward: 50, done: false },
  { id: 4, name: "10分間読書する", reward: 50, done: false },
];

const Avatar = ({ rank, size = "large" }) => {
  const width = size === "large" ? '80px' : '60px';
  const height = size === "large" ? '120px' : '90px';
  const fontSize = size === "large" ? '50px' : '40px';
  return (
    <div className="pixel-border bg-blue-800 rounded flex items-center justify-center flex-shrink-0 shadow-inner" style={{ width, height, fontSize }}>
      <span style={{ textShadow: '2px 2px 0 #000' }}>{rank.avatar}</span>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  
  // --- セーブ対象ステート ---
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [wallet, setWallet] = useState(0);
  const [invest, setInvest] = useState(0);
  const [exp, setExp] = useState(0);
  const [consecutiveDays, setConsecutiveDays] = useState(1);
  const [monthlyLogins, setMonthlyLogins] = useState(1);
  const [tickets, setTickets] = useState(1);
  const [boostTickets, setBoostTickets] = useState(1);
  const [lastLoginDate, setLastLoginDate] = useState('');
  
  // --- UI用ステート（セーブ不要） ---
  const [boostActive, setBoostActive] = useState(false);
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
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loginPopupData, setLoginPopupData] = useState(null);

  const messageIdRef = useRef(0);
  const isLoaded = useRef(false);

  // --- データロード ---
  useEffect(() => {
    const saved = localStorage.getItem('habit_rpg_save');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setTasks(data.tasks || INITIAL_TASKS);
        setWallet(data.wallet || 0);
        setInvest(data.invest || 0);
        setExp(data.exp || 0);
        setConsecutiveDays(data.consecutiveDays || 1);
        setMonthlyLogins(data.monthlyLogins || 1);
        setTickets(data.tickets || 1);
        setBoostTickets(data.boostTickets || 1);
        setLastLoginDate(data.lastLoginDate || '');
      } catch (e) {
        console.error("Save data load error");
      }
    }
    isLoaded.current = true;
  }, []);

  // --- データセーブ ---
  useEffect(() => {
    if (isLoaded.current) {
      const dataToSave = { tasks, wallet, invest, exp, consecutiveDays, monthlyLogins, tickets, boostTickets, lastLoginDate };
      localStorage.setItem('habit_rpg_save', JSON.stringify(dataToSave));
    }
  }, [tasks, wallet, invest, exp, consecutiveDays, monthlyLogins, tickets, boostTickets, lastLoginDate]);

  // --- ログイン日替わり処理 ---
  useEffect(() => {
    if (!isLoaded.current) return;
    const todayStr = new Date().toISOString().split('T')[0];
    
    if (lastLoginDate !== todayStr) {
      // 日付が変わった時の処理
      const today = new Date();
      const lastLogin = lastLoginDate ? new Date(lastLoginDate) : new Date();
      lastLogin.setHours(0,0,0,0);
      today.setHours(0,0,0,0);
      const diffDays = Math.round((today - lastLogin) / (1000 * 60 * 60 * 24));

      let nextStreak = consecutiveDays;
      let nextMonthly = monthlyLogins;
      let interest = 0;
      
      // タスクリセット
      setTasks(prev => prev.map(t => ({ ...t, done: false })));
      setBoostActive(false);

      if (lastLoginDate === '') {
        // 初回起動
        triggerLoginPopup(1, 1, 0, false, 'タイムリープ', 0, false);
        setLastLoginDate(todayStr);
        return;
      }

      if (today.getMonth() !== lastLogin.getMonth()) {
        // 月初め
        nextMonthly = 1;
        if (invest > 0) {
          interest = Math.floor(invest * 0.01);
          setInvest(prev => prev + interest);
        }
      } else if (diffDays > 0) {
        nextMonthly += 1;
      }

      if (diffDays === 1) {
        nextStreak += 1;
      } else if (diffDays > 1) {
        nextStreak = 1; // 途切れた
      }

      setConsecutiveDays(nextStreak);
      setMonthlyLogins(nextMonthly);
      setLastLoginDate(todayStr);

      const { bonusMoney, gotTicket, ticketType } = checkMonthlyLoginBonus(nextMonthly);
      
      let isHundred = false;
      let finalMoney = bonusMoney;
      if (nextStreak > 0 && nextStreak % 100 === 0) {
        isHundred = true;
        finalMoney += 1000;
        addMoney(1000);
        setTickets(prev => prev + 1);
        setBoostTickets(prev => prev + 1);
      }

      triggerLoginPopup(nextStreak, nextMonthly, finalMoney, gotTicket || isHundred, ticketType, interest, isHundred);
    }
  }, [lastLoginDate]);

  // --- Helpers ---
  const addMessage = (text) => {
    const id = `${Date.now()}-${messageIdRef.current++}`;
    setMessages(prev => [...prev, { id, text }]);
    setTimeout(() => setMessages(prev => prev.filter(m => m.id !== id)), 4000);
  };

  const triggerLoginPopup = (streak, monthlyCount, rewardAmt, gotTicket, ticketType, interest, isHundredBonus) => {
    setLoginPopupData({ streak, monthlyCount, rewardAmt, gotTicket, ticketType, interest, isHundredBonus });
    setShowLoginPopup(true);
  };

  const currentRank = [...RANKS].reverse().find(r => exp >= r.exp) || RANKS[0];
  const nextRank = RANKS.find(r => r.exp > exp);
  const progressPercent = nextRank ? Math.min(100, ((exp - currentRank.exp) / (nextRank.exp - currentRank.exp)) * 100) : 100;
  
  const getRandomMsg = () => currentRank.msgs[Math.floor(Math.random() * currentRank.msgs.length)];

  const addMoney = (amount) => {
    setWallet(prevWallet => {
      let newWallet = prevWallet + amount;
      if (newWallet > 3000) {
        const overflow = newWallet - 3000;
        setInvest(prevInvest => prevInvest + overflow);
        addMessage(`財布が一杯！超過分 ${overflow}円 を投資へ！`);
        return 3000;
      }
      return newWallet;
    });
  };

  const completeTask = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId && !t.done) {
        const finalReward = boostActive ? Math.floor(t.reward * 1.5) : t.reward;
        addMoney(finalReward);
        setExp(prevExp => prevExp + 10);
        addMessage(`[達成] ${t.name} : ${finalReward}円 / +10EXP`);
        return { ...t, done: true };
      }
      return t;
    }));
  };

  const checkMonthlyLoginBonus = (dayCount) => {
    let bonusMoney = 0; let gotTicket = false; let ticketType = '';
    if (dayCount === 5) { bonusMoney = 200; } 
    else if (dayCount === 10) { bonusMoney = 300; gotTicket = true; ticketType = 'タイムリープ'; setTickets(p => p + 1); } 
    else if (dayCount === 15) { bonusMoney = 350; } 
    else if (dayCount === 20) { bonusMoney = 400; gotTicket = true; ticketType = '報酬ブースト'; setBoostTickets(p => p + 1); } 
    else if (dayCount === 25) { bonusMoney = 500; } 
    else if (dayCount === 30) { bonusMoney = 600; gotTicket = true; ticketType = 'タイムリープ'; setTickets(p => p + 1); }
    if (bonusMoney > 0) addMoney(bonusMoney);
    return { bonusMoney, gotTicket, ticketType };
  };

  // --- Views ---
  const renderHome = () => (
    <div className="flex flex-col h-full overflow-y-auto pb-24 bg-gray-100 text-gray-800">
      <div className="bg-blue-900 text-white p-4 pixel-border m-4 shadow-lg">
        <div className="flex items-center gap-4 mb-2">
          <Avatar rank={currentRank} size="large" />
          <div className="flex-1">
            <div className="text-sm text-blue-300 mb-1">{currentDate}</div>
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
          <div className="flex-1 bg-white p-4 pixel-border shadow-md flex items-center gap-2">
            <Wallet className="text-orange-500 w-8 h-8" />
            <div>
              <div className="text-[10px] text-gray-500 font-bold">お財布(上限3000)</div>
              <div className="text-xl font-bold text-gray-800">{wallet}円</div>
            </div>
          </div>
          <div className="flex-1 bg-white p-4 pixel-border shadow-md flex items-center gap-2">
            <TrendingUp className="text-blue-500 w-8 h-8" />
            <div>
              <div className="text-[10px] text-gray-500 font-bold">投資口座</div>
              <div className="text-xl font-bold text-blue-700">{invest}円</div>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-3 pixel-border border-yellow-300 flex justify-around text-sm">
          <div className="flex items-center gap-1.5 font-bold text-yellow-800">
            <Ticket size={20} className="text-yellow-600" />
            <span>復活: {tickets}枚</span>
          </div>
          <div className="border-l border-yellow-300"></div>
          <div className="flex items-center gap-1.5 font-bold text-red-800">
            <Award size={20} className="text-red-600" />
            <span>ブースト: {boostTickets}枚</span>
          </div>
        </div>
      </div>

      <div className="px-4">
        <div className="flex justify-between items-center mb-3 border-b-2 border-gray-300 pb-1">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <CheckSquare size={24} /> 本日の業務
          </h3>
          <button onClick={() => { setEditingTasks([...tasks]); setNewTaskName(''); setIsEditModalOpen(true); }} className="text-sm bg-gray-800 text-white px-3 py-1.5 pixel-border hover:bg-black flex items-center gap-1">
            <Edit3 size={16} /> タスク編集
          </button>
        </div>

        <div className="space-y-4">
          {tasks.map(task => {
            const displayReward = boostActive ? Math.floor(task.reward * 1.5) : task.reward;
            return (
              <button
                key={task.id}
                onClick={() => completeTask(task.id)}
                disabled={task.done}
                className={`w-full text-left p-5 pixel-border shadow-sm flex items-center justify-between transition-all min-h-[80px] ${task.done ? 'bg-gray-200 opacity-60' : 'bg-white active:bg-blue-50'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 flex items-center justify-center pixel-border ${task.done ? 'bg-green-500' : 'bg-white'}`}>
                    {task.done && <UserCheck size={24} className="text-white" />}
                  </div>
                  <span className={`text-lg ${task.done ? 'line-through text-gray-500' : 'font-bold text-gray-800'}`}>
                    {task.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-orange-600 flex items-center gap-1 justify-end">
                    {boostActive && <span className="text-sm line-through text-gray-400 font-normal">{task.reward}円</span>}
                    <span>{displayReward}円</span>
                  </div>
                  <div className="text-sm text-blue-600 font-bold">+10 EXP</div>
                </div>
              </button>
            );
          })}
          {tasks.length === 0 && (
            <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-300 rounded bg-white text-lg font-bold">
              タスクがありません。<br/>「タスク編集」から追加してください。
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderParent = () => {
    if (!parentUnlocked) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-gray-100">
          <Lock size={64} className="text-gray-400 mb-6" />
          <h2 className="text-2xl font-bold mb-3 text-gray-800">保護者管理システム</h2>
          <p className="text-base text-gray-600 mb-8">ここから先は親専用の画面です。<br/>出金や投資、チケット給与の設定を行います。</p>
          <input type="password" placeholder="PINコードを入力" className="p-4 text-center text-2xl tracking-widest pixel-border w-64 mb-3 focus:outline-none"
            value={pinInput} onChange={(e) => { setPinInput(e.target.value); setPinError(''); }} />
          {pinError && <p className="text-red-500 text-base font-bold mb-4">{pinError}</p>}
          <button onClick={() => { if (pinInput === '5454') { setParentUnlocked(true); setPinInput(''); } else { setPinError('パスワードが違います'); } }}
            className="bg-gray-800 text-white px-10 py-4 pixel-border font-bold text-lg w-64"
          >
            ロック解除
          </button>
        </div>
      );
    }
    return (
      <div className="flex flex-col h-full overflow-y-auto pb-24 p-4 bg-gray-100 text-gray-800">
        <div className="flex justify-between items-center mb-6 border-b-2 border-gray-800 pb-2">
          <h2 className="text-xl font-bold flex items-center gap-2"><Lock size={20} className="text-red-600" /> 管理メニュー</h2>
          <button onClick={() => setParentUnlocked(false)} className="text-sm bg-gray-200 px-3 py-1 pixel-border font-bold">ロックする</button>
        </div>

        <div className="bg-white p-5 pixel-border mb-6 shadow-md border-t-4 border-t-orange-500">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2"><Wallet size={20}/> お小遣いの精算（月初）</h3>
          <p className="text-sm text-gray-600 mb-4">現在の財布の残高を現金として子供に渡し、アプリの財布を0円にリセットします。</p>
          <div className="flex justify-between items-center bg-gray-100 p-4 mb-4">
            <span className="font-bold">現在の財布残高:</span>
            <span className="text-2xl font-bold text-orange-600">{wallet} 円</span>
          </div>
          <button onClick={() => { addMessage(`財布から ${wallet}円 を出金しました。`); setWallet(0); }} disabled={wallet === 0}
            className={`w-full py-4 pixel-border font-bold text-lg ${wallet > 0 ? 'bg-orange-500 text-white' : 'bg-gray-300 text-gray-500'}`}
          >{wallet}円 を出金してリセット</button>
        </div>

        <div className="bg-white p-5 pixel-border mb-6 shadow-md border-t-4 border-t-blue-500">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2"><TrendingUp size={20}/> 投資口座の管理</h3>
          <div className="flex justify-between items-center bg-gray-100 p-4 mb-5">
            <span className="font-bold">現在の投資残高:</span>
            <span className="text-2xl font-bold text-blue-700">{invest} 円</span>
          </div>
          <div className="space-y-5">
            <div className="flex gap-2">
              <input type="number" placeholder="出金額を入力" className="flex-1 p-3 pixel-border text-right text-lg" value={investWithdrawAmount} onChange={e => setInvestWithdrawAmount(e.target.value)} />
              <button onClick={() => { const amt = parseInt(investWithdrawAmount); if (amt > 0 && amt <= invest) { setInvest(p => p - amt); addMessage(`投資から ${amt}円 出金しました。`); setInvestWithdrawAmount(''); } else { addMessage("正しい金額を入力してください"); } }}
                className="bg-gray-800 text-white px-5 py-3 pixel-border font-bold">出金する</button>
            </div>
            <div className="flex gap-2">
              <input type="number" placeholder="入金額を入力" className="flex-1 p-3 pixel-border text-right text-lg" value={investDepositAmount} onChange={e => setInvestDepositAmount(e.target.value)} />
              <button onClick={() => { const amt = parseInt(investDepositAmount); if (amt > 0) { setInvest(p => p + amt); addMessage(`投資に ${amt}円 入金しました！`); setInvestDepositAmount(''); } else { addMessage("正しい金額を入力してください"); } }}
                className="bg-blue-600 text-white px-5 py-3 pixel-border font-bold">入金する</button>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 pixel-border mb-6 shadow-md border-t-4 border-t-yellow-500">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2"><Ticket size={20}/> ご褒美チケットの支給</h3>
          <div className="flex items-center gap-3 mb-5">
            <label className="text-base font-bold">枚数:</label>
            <input type="number" min="1" className="p-2 pixel-border w-24 text-center text-lg" value={parentTicketAmount} onChange={e => setParentTicketAmount(Math.max(1, parseInt(e.target.value) || 1))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => { setTickets(p => p + parentTicketAmount); addMessage(`復活チケットを ${parentTicketAmount}枚 付与しました！`); }} className="bg-yellow-500 text-white p-3 pixel-border font-bold">復活チケット付与</button>
            <button onClick={() => { setBoostTickets(p => p + parentTicketAmount); addMessage(`ブーストチケットを ${parentTicketAmount}枚 付与しました！`); }} className="bg-red-500 text-white p-3 pixel-border font-bold">ブースト付与</button>
          </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="flex flex-col h-full overflow-y-auto pb-24 p-4 bg-gray-100 text-gray-800">
      <h2 className="text-2xl font-bold mb-5 border-b-2 border-gray-300 pb-2 flex items-center gap-2"><Settings size={24} /> 設定とお助け</h2>

      <div className="bg-yellow-50 p-5 pixel-border mb-6 border-yellow-200">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-yellow-800"><Ticket size={20} /> チケットお助けシステム</h3>
        
        <div className="bg-white p-4 pixel-border mb-4 border-yellow-300">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold text-base">タイムリープ（連続補填）</h4>
            <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 font-bold rounded">消費: 1枚</span>
          </div>
          <button onClick={() => { if (tickets >= 1) { setTickets(p => p - 1); setConsecutiveDays(p => p + 1); addMessage("タイムリープ発動！連続記録を復活しました！"); } else { addMessage("復活チケットがありません！"); } }}
            className="w-full bg-yellow-500 text-white py-3 pixel-border text-sm font-bold active:bg-yellow-600"
          >タイムリープを使う (所持: {tickets}枚)</button>
        </div>

        <div className="bg-white p-4 pixel-border border-red-300">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold text-base text-red-800">報酬1.5倍ブースト</h4>
            <span className="text-sm bg-red-100 text-red-800 px-3 py-1 font-bold rounded">消費: 1枚</span>
          </div>
          <button onClick={() => { if (boostActive) { addMessage("すでに発動しています！"); return; } if (boostTickets >= 1) { setBoostTickets(p => p - 1); setBoostActive(true); addMessage("報酬1.5倍ブースト発動！本日の報酬がアップ！"); } else { addMessage("ブーストチケットがありません！"); } }}
            disabled={boostActive}
            className={`w-full py-3 pixel-border text-sm font-bold text-white ${boostActive ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 active:bg-red-600'}`}
          >{boostActive ? "ブースト適用中" : `ブーストを使う (所持: ${boostTickets}枚)`}</button>
        </div>
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
      `}</style>
      <div className="max-w-md mx-auto h-screen bg-gray-100 flex flex-col dot-font text-gray-800 relative select-none">
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md z-10">
          <h1 className="text-xl font-bold tracking-wider">Habit RPG</h1>
          <div className="flex gap-3 text-sm">
            <div className="bg-black px-2 py-1.5 rounded pixel-border border-gray-600 border-2">通算連続: {consecutiveDays}日</div>
            <div className="bg-blue-900 px-2 py-1.5 rounded pixel-border border-blue-700 border-2">今月ログ: {monthlyLogins}日</div>
          </div>
        </header>
        <main className="flex-1 overflow-hidden relative">
          {activeTab === 'home' && renderHome()}
          {activeTab === 'parent' && renderParent()}
          {activeTab === 'settings' && renderSettings()}
          <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center pointer-events-none z-50 px-4 space-y-2">
            {messages.map(m => (
              <div key={m.id} className="bg-black text-white px-5 py-4 rounded text-base font-bold w-full shadow-[0_4px_15px_rgba(0,0,0,0.5)] border-2 border-white animate-pulse pointer-events-auto">{m.text}</div>
            ))}
          </div>
        </main>
        <nav className="bg-gray-300 border-t-4 border-gray-800 flex absolute bottom-0 w-full h-20 z-20">
          <button onClick={() => setActiveTab('home')} className={`flex-1 flex flex-col items-center justify-center pixel-nav-item ${activeTab === 'home' ? 'active' : ''}`}>
            <Home size={28} className="mb-1" /><span className="text-xs font-bold">ホーム</span>
          </button>
          <button onClick={() => setActiveTab('parent')} className={`flex-1 flex flex-col items-center justify-center pixel-nav-item ${activeTab === 'parent' ? 'active' : ''}`}>
            <Lock size={28} className="mb-1" /><span className="text-xs font-bold">親管理</span>
          </button>
          <button onClick={() => setActiveTab('settings')} className={`flex-1 flex flex-col items-center justify-center pixel-nav-item ${activeTab === 'settings' ? 'active' : ''}`}>
            <Settings size={28} className="mb-1" /><span className="text-xs font-bold">設定</span>
          </button>
        </nav>

        {showLoginPopup && loginPopupData && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
            <div className="bg-blue-900 border-4 border-yellow-400 text-white w-full max-w-sm p-6 pixel-border relative text-center">
              <div className="text-yellow-400 text-3xl font-bold mb-4 animate-bounce">✨ LOGIN BONUSES ✨</div>
              {loginPopupData.isHundredBonus && (
                <div className="bg-red-600 text-white p-4 pixel-border font-bold mb-5 border-2 border-yellow-300 animate-pulse">
                  🎊 祝！通算 {loginPopupData.streak} 日達成 🎊<br/><span className="text-sm">継続の達人！特別ボーナス支給！</span>
                </div>
              )}
              <div className="bg-black/40 p-5 rounded pixel-border border-blue-700 mb-5 space-y-4">
                <div className="text-xl">連続記録：<span className="text-yellow-400 text-3xl font-bold"> {loginPopupData.streak} </span> 日</div>
                <div className="text-base text-gray-300 border-t border-blue-800 pt-3">今月のログ：<span className="text-blue-300 font-bold text-xl"> {loginPopupData.monthlyCount} </span> 日</div>
              </div>
              {loginPopupData.interest > 0 && (
                <div className="bg-blue-800 text-white p-4 pixel-border mb-5 border-2 border-blue-400">
                  📈 投資アップデート<br/><div className="text-2xl text-yellow-300 font-bold mt-2">利息 +{loginPopupData.interest} 円！</div>
                </div>
              )}
              {loginPopupData.rewardAmt > 0 ? (
                <div className="bg-yellow-500 text-black p-4 pixel-border font-bold mb-5">
                  🎉 ボーナス発生！ 🎉<div className="text-2xl mt-1">お小遣い +{loginPopupData.rewardAmt} 円</div>
                  {loginPopupData.isHundredBonus ? ( <div className="text-sm mt-2 text-red-950 font-bold">「復活」「ブースト」各1枚ゲット！</div>
                  ) : loginPopupData.gotTicket ? ( <div className="text-sm mt-2 text-red-950 font-bold">「{loginPopupData.ticketType}チケット」ゲット！</div>
                  ) : null}
                </div>
              ) : (
                <div className="text-sm text-gray-300 mb-5">次のボーナス：5日ログインで200円<br />（5,10,20,25日にボーナス！）</div>
              )}
              <div className="text-2xl mb-5 text-yellow-300 flex flex-col items-center gap-4">
                <Avatar rank={currentRank} size="large" /><span>「今日もいい仕事にしよう！」</span>
              </div>
              <button onClick={() => setShowLoginPopup(false)} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-4 pixel-border font-bold text-xl">
                了解（仕事開始）
              </button>
            </div>
          </div>
        )}

        {isEditModalOpen && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-sm p-5 pixel-border flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center mb-5 border-b-2 border-gray-800 pb-2">
                <h3 className="font-bold text-xl flex items-center gap-2"><Edit3 size={24} /> タスク編集</h3>
                <button onClick={() => setIsEditModalOpen(false)}><X size={28} /></button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 mb-5 pr-1">
                {editingTasks.map((t) => (
                  <div key={t.id} className="p-3 border-2 border-gray-800 flex items-center justify-between gap-3 bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-lg truncate">{t.name}</div>
                      <div className="text-sm text-orange-600 font-bold mt-1">{t.reward}円 ({t.reward === 100 ? 'ハード' : 'ノーマル'})</div>
                    </div>
                    <button onClick={() => setEditingTasks(editingTasks.filter(x => x.id !== t.id))} className="p-2 bg-red-100 text-red-600 pixel-border border-red-300 hover:bg-red-200">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="border-t-2 border-gray-800 pt-4 space-y-4">
                <div className="text-sm font-bold">新規タスク追加 (最大5個)</div>
                <input type="text" placeholder="タスクを入力" className="w-full p-3 pixel-border text-base focus:outline-none" value={newTaskName} onChange={e => setNewTaskName(e.target.value)} />
                <div className="flex justify-between items-center gap-2">
                  <span className="text-sm font-bold">難易度：</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setNewTaskReward(50)} className={`px-4 py-2 text-sm font-bold pixel-border ${newTaskReward === 50 ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}>ノーマル (50円)</button>
                    <button type="button" onClick={() => setNewTaskReward(100)} className={`px-4 py-2 text-sm font-bold pixel-border ${newTaskReward === 100 ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>ハード (100円)</button>
                  </div>
                </div>
                <button onClick={() => { if(newTaskName.trim() && editingTasks.length < 5) { setEditingTasks([...editingTasks, { id: Date.now(), name: newTaskName, reward: newTaskReward, done: false }]); setNewTaskName(''); } }} 
                  disabled={editingTasks.length >= 5 || !newTaskName.trim()}
                  className={`w-full py-3.5 pixel-border font-bold text-lg ${editingTasks.length >= 5 || !newTaskName.trim() ? 'bg-gray-300 text-gray-500' : 'bg-green-600 text-white'}`}>
                  リストに追加
                </button>
              </div>
              <div className="border-t-2 border-gray-800 pt-4 mt-4 flex gap-3">
                <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 bg-gray-200 pixel-border font-bold text-lg">キャンセル</button>
                <button onClick={() => { setTasks(editingTasks); setIsEditModalOpen(false); addMessage("タスクを更新しました！"); }} className="flex-1 py-3 bg-gray-800 text-white pixel-border font-bold text-lg">保存する</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
