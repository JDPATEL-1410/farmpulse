
import bcrypt from 'bcryptjs';
import {
  Farm, Worker, WorkerTransaction, FertilizerExpense, TractorExpense,
  OtherExpense, TransactionType, User, UserRole, Organization,
  ActivityLog, DashboardStats
} from '../types';

/**
 * Enterprise Database Service (v3)
 * Professional-grade data management with organization support
 */

const getStorageKey = (userId: string) => `FARMPULSE_USER_${userId}`;
const USERS_KEY = 'FARMPULSE_USERS';
const ORGANIZATIONS_KEY = 'FARMPULSE_ORGANIZATIONS';
const ACTIVITY_LOGS_KEY = 'FARMPULSE_ACTIVITY_LOGS';

interface UserData {
  farms: Farm[];
  workers: Worker[];
  workerTransactions: WorkerTransaction[];
  fertilizers: FertilizerExpense[];
  tractors: TractorExpense[];
  others: OtherExpense[];
}

const initialUserData: UserData = {
  farms: [],
  workers: [],
  workerTransactions: [],
  fertilizers: [],
  tractors: [],
  others: [],
};

// Simulated MongoDB Connection
let isConnected = false;

const generateToken = (user: User) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({
    id: user.id,
    username: user.username,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)
  }));
  const signature = btoa("secure_" + user.id + "_" + Date.now());
  return `${header}.${payload}.${signature}`;
};

const logActivity = (userId: string, action: string, entity: string, entityId: string, details?: string) => {
  const logs: ActivityLog[] = JSON.parse(localStorage.getItem(ACTIVITY_LOGS_KEY) || '[]');
  const log: ActivityLog = {
    id: crypto.randomUUID(),
    userId,
    action,
    entity,
    entityId,
    timestamp: new Date().toISOString(),
    details
  };
  logs.push(log);
  // Keep only last 1000 logs
  if (logs.length > 1000) logs.shift();
  localStorage.setItem(ACTIVITY_LOGS_KEY, JSON.stringify(logs));
};

export const dbService = {
  // Connection
  connect: async () => {
    if (isConnected) return true;
    console.log('🔄 Connecting to database...');
    await new Promise(resolve => setTimeout(resolve, 800));
    isConnected = true;
    console.log('✅ Database connected');
    return true;
  },

  // USER MANAGEMENT
  getAllUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveUsers: (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  registerUser: async (username: string, password: string, email?: string, fullName?: string): Promise<{ user: User, token: string }> => {
    await dbService.connect();
    const users = dbService.getAllUsers();

    if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
      throw new Error('Username already exists. Please choose a different username.');
    }

    if (email && users.find(u => u.email?.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email already registered.');
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      email,
      fullName,
      password: hashedPassword,
      role: UserRole.ADMIN, // Default role
      createdAt: new Date().toISOString(),
      isActive: true
    };

    users.push(newUser);
    dbService.saveUsers(users);

    // Initialize user data
    localStorage.setItem(getStorageKey(newUser.id), JSON.stringify(initialUserData));

    const token = generateToken(newUser);
    logActivity(newUser.id, 'REGISTER', 'USER', newUser.id, 'New user registered');

    return { user: newUser, token };
  },

  authenticateUser: async (username: string, password: string): Promise<{ user: User, token: string } | null> => {
    await dbService.connect();
    const users = dbService.getAllUsers();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

    if (user && user.isActive && bcrypt.compareSync(password, user.password || '')) {
      // Update last login
      user.lastLogin = new Date().toISOString();
      dbService.saveUsers(users);

      const token = generateToken(user);
      logActivity(user.id, 'LOGIN', 'USER', user.id, 'User logged in');
      return { user, token };
    }
    return null;
  },

  resetPassword: async (username: string, newPassword: string): Promise<boolean> => {
    await dbService.connect();
    const users = dbService.getAllUsers();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) throw new Error('User not found');

    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(newPassword, salt);
    dbService.saveUsers(users);

    logActivity(user.id, 'PASSWORD_RESET', 'USER', user.id, 'Password reset');
    return true;
  },

  updateUser: (userId: string, updates: Partial<User>) => {
    const users = dbService.getAllUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      dbService.saveUsers(users);
      logActivity(userId, 'UPDATE', 'USER', userId, 'User profile updated');
    }
  },

  deleteUser: (userId: string) => {
    const users = dbService.getAllUsers().filter(u => u.id !== userId);
    dbService.saveUsers(users);
    localStorage.removeItem(getStorageKey(userId));
    logActivity(userId, 'DELETE', 'USER', userId, 'User deleted');
  },

  // DATA MANAGEMENT
  getUserData: (userId: string): UserData => {
    const data = localStorage.getItem(getStorageKey(userId));
    return data ? JSON.parse(data) : initialUserData;
  },

  saveUserData: (userId: string, data: UserData) => {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(data));
  },

  // FARMS
  getFarms: (userId: string) => dbService.getUserData(userId).farms.filter(f => f.isActive),

  getFarmById: (userId: string, id: string) => dbService.getUserData(userId).farms.find(f => f.id === id),

  addFarm: (userId: string, farm: Omit<Farm, 'id' | 'createdAt' | 'isActive'>) => {
    const data = dbService.getUserData(userId);
    const newFarm: Farm = {
      ...farm,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      isActive: true
    };
    data.farms.push(newFarm);
    dbService.saveUserData(userId, data);
    logActivity(userId, 'CREATE', 'FARM', newFarm.id, `Farm created: ${farm.name}`);
    return newFarm;
  },

  updateFarm: (userId: string, farmId: string, updates: Partial<Farm>) => {
    const data = dbService.getUserData(userId);
    const index = data.farms.findIndex(f => f.id === farmId);
    if (index !== -1) {
      data.farms[index] = { ...data.farms[index], ...updates, updatedAt: new Date().toISOString() };
      dbService.saveUserData(userId, data);
      logActivity(userId, 'UPDATE', 'FARM', farmId, 'Farm updated');
    }
  },

  deleteFarm: (userId: string, id: string) => {
    const data = dbService.getUserData(userId);
    const farm = data.farms.find(f => f.id === id);
    if (farm) {
      farm.isActive = false;
      dbService.saveUserData(userId, data);
      logActivity(userId, 'DELETE', 'FARM', id, `Farm deleted: ${farm.name}`);
    }
  },

  // WORKERS
  getWorkers: (userId: string, farmId?: string) => {
    const data = dbService.getUserData(userId);
    const workers = data.workers.filter(w => w.isActive);
    return farmId && farmId !== 'ALL' ? workers.filter(w => w.farmId === farmId) : workers;
  },

  addWorker: (userId: string, worker: Omit<Worker, 'id' | 'isActive'>) => {
    const data = dbService.getUserData(userId);
    const newWorker: Worker = { ...worker, id: crypto.randomUUID(), isActive: true };
    data.workers.push(newWorker);
    dbService.saveUserData(userId, data);
    logActivity(userId, 'CREATE', 'WORKER', newWorker.id, `Worker added: ${worker.name}`);
    return newWorker;
  },

  updateWorker: (userId: string, workerId: string, updates: Partial<Worker>) => {
    const data = dbService.getUserData(userId);
    const index = data.workers.findIndex(w => w.id === workerId);
    if (index !== -1) {
      data.workers[index] = { ...data.workers[index], ...updates };
      dbService.saveUserData(userId, data);
      logActivity(userId, 'UPDATE', 'WORKER', workerId, 'Worker updated');
    }
  },

  deleteWorker: (userId: string, workerId: string) => {
    const data = dbService.getUserData(userId);
    const worker = data.workers.find(w => w.id === workerId);
    if (worker) {
      worker.isActive = false;
      dbService.saveUserData(userId, data);
      logActivity(userId, 'DELETE', 'WORKER', workerId, `Worker removed: ${worker.name}`);
    }
  },

  // TRANSACTIONS
  getWorkerTransactions: (userId: string, workerId: string) => {
    const data = dbService.getUserData(userId);
    return data.workerTransactions
      .filter(t => t.workerId === workerId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  getWorkerBalance: (userId: string, workerId: string) => {
    const txs = dbService.getWorkerTransactions(userId, workerId);
    return txs.reduce((acc, curr) => {
      return curr.type === TransactionType.LOAN || curr.type === TransactionType.ADVANCE
        ? acc + curr.amount
        : acc - curr.amount;
    }, 0);
  },

  addTransaction: (userId: string, tx: Omit<WorkerTransaction, 'id' | 'createdBy'>) => {
    const data = dbService.getUserData(userId);
    const newTx: WorkerTransaction = { ...tx, id: crypto.randomUUID(), createdBy: userId };
    data.workerTransactions.push(newTx);
    dbService.saveUserData(userId, data);
    logActivity(userId, 'CREATE', 'TRANSACTION', newTx.id, `Transaction: ${tx.type} - ₹${tx.amount}`);
    return newTx;
  },

  // EXPENSES
  addFertilizer: (userId: string, exp: Omit<FertilizerExpense, 'id' | 'createdBy'>) => {
    const data = dbService.getUserData(userId);
    const newExp: FertilizerExpense = { ...exp, id: crypto.randomUUID(), createdBy: userId };
    data.fertilizers.push(newExp);
    dbService.saveUserData(userId, data);
    logActivity(userId, 'CREATE', 'EXPENSE', newExp.id, `Fertilizer expense: ₹${exp.cost}`);
  },

  addTractor: (userId: string, exp: Omit<TractorExpense, 'id' | 'createdBy'>) => {
    const data = dbService.getUserData(userId);
    const newExp: TractorExpense = { ...exp, id: crypto.randomUUID(), createdBy: userId };
    data.tractors.push(newExp);
    dbService.saveUserData(userId, data);
    logActivity(userId, 'CREATE', 'EXPENSE', newExp.id, `Tractor expense: ₹${exp.cost}`);
  },

  addOtherExpense: (userId: string, exp: Omit<OtherExpense, 'id' | 'createdBy'>) => {
    const data = dbService.getUserData(userId);
    const newExp: OtherExpense = { ...exp, id: crypto.randomUUID(), createdBy: userId };
    data.others.push(newExp);
    dbService.saveUserData(userId, data);
    logActivity(userId, 'CREATE', 'EXPENSE', newExp.id, `Other expense: ₹${exp.amount}`);
  },

  // REPORTS
  getFarmReport: (userId: string, farmId: string, startDate?: string, endDate?: string) => {
    const data = dbService.getUserData(userId);
    const filterByDate = (d: string) => {
      if (!startDate && !endDate) return true;
      const date = new Date(d);
      if (startDate && date < new Date(startDate)) return false;
      if (endDate && date > new Date(endDate)) return false;
      return true;
    };

    const ferts = data.fertilizers.filter(f => f.farmId === farmId && filterByDate(f.date));
    const tractors = data.tractors.filter(t => t.farmId === farmId && filterByDate(t.date));
    const others = data.others.filter(o => o.farmId === farmId && filterByDate(o.date));

    const fertCost = ferts.reduce((sum, f) => sum + f.cost, 0);
    const tractorCost = tractors.reduce((sum, t) => sum + t.cost, 0);
    const otherCost = others.reduce((sum, o) => sum + o.amount, 0);

    return {
      fertilizerCost: fertCost,
      tractorCost: tractorCost,
      otherExpenseCost: otherCost,
      total: fertCost + tractorCost + otherCost,
      count: ferts.length + tractors.length + others.length,
      records: { fertilizers: ferts, tractors, others }
    };
  },

  // DASHBOARD STATS
  getDashboardStats: (userId: string): DashboardStats => {
    const data = dbService.getUserData(userId);
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyExpenses = [
      ...data.fertilizers.filter(f => new Date(f.date) >= firstDayOfMonth),
      ...data.tractors.filter(t => new Date(t.date) >= firstDayOfMonth),
      ...data.others.filter(o => new Date(o.date) >= firstDayOfMonth)
    ].reduce((sum, exp: any) => sum + (exp.cost || exp.amount), 0);

    const totalExpenses = [
      ...data.fertilizers,
      ...data.tractors,
      ...data.others
    ].reduce((sum, exp: any) => sum + (exp.cost || exp.amount), 0);

    const pendingPayments = data.workers
      .filter(w => w.isActive)
      .reduce((sum, w) => {
        const balance = dbService.getWorkerBalance(userId, w.id);
        return sum + (balance > 0 ? balance : 0);
      }, 0);

    return {
      totalFarms: data.farms.filter(f => f.isActive).length,
      totalWorkers: data.workers.filter(w => w.isActive).length,
      totalExpenses,
      monthlyExpenses,
      activeWorkers: data.workers.filter(w => w.isActive).length,
      pendingPayments
    };
  },

  // ACTIVITY LOGS
  getActivityLogs: (userId?: string, limit: number = 50): ActivityLog[] => {
    const logs: ActivityLog[] = JSON.parse(localStorage.getItem(ACTIVITY_LOGS_KEY) || '[]');
    const filtered = userId ? logs.filter(l => l.userId === userId) : logs;
    return filtered.slice(-limit).reverse();
  },

  // ADMIN FUNCTIONS
  getAllUsersAdmin: (): User[] => {
    return dbService.getAllUsers().map(u => ({ ...u, password: undefined }));
  },

  toggleUserStatus: (userId: string) => {
    const users = dbService.getAllUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      user.isActive = !user.isActive;
      dbService.saveUsers(users);
      logActivity(userId, user.isActive ? 'ACTIVATE' : 'DEACTIVATE', 'USER', userId);
    }
  }
};
