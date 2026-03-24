const Database = require('better-sqlite3');

const createTodosTableSQL = `
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL,
    completed INTEGER DEFAULT 0
  )`;
const createPlayersTableSQL = `
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`;
const createMatchupNotesTableSQL = `
  CREATE TABLE IF NOT EXISTS matchup_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL,
    opponent_id INTEGER NOT NULL,
    notes TEXT,
    matchup_date TEXT,
    points INTEGER DEFAULT 0,
    assists INTEGER DEFAULT 0,
    rebounds INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`;

  // USER CANNOT ADD PLAYER NAMED EVERYONE


function createDatabaseManager(dbPath) {
  const database = new Database(dbPath);
  console.log('Database manager created for:', dbPath);
  database.pragma('foreign_keys = ON');
  database.exec(createTodosTableSQL);
  database.exec(createPlayersTableSQL);
  database.exec(createMatchupNotesTableSQL);

  function ensureConnected() {
    if (!database.open) {
      throw new Error('Database connection is not open');
    }
  }
  return {
    dbHelpers: {

      clearDatabase: () => {
        if (process.env.NODE_ENV === 'test') {
          ensureConnected();
          database.prepare('DELETE FROM todos').run();
        } else {
          console.warn('clearDatabase called outside of test environment. FIXME!');
        }
      },

      seedTestData: () => {
        if (process.env.NODE_ENV === 'test') {
          ensureConnected();
          const insert = database.prepare('INSERT INTO todos (task, completed) VALUES (?, ?)');
          const testData = [
            { task: 'Test task 1', completed: 0 },
            { task: 'Test task 2', completed: 1 },
            { task: 'Test task 3', completed: 0 },
          ];
          const insertMany = database.transaction((todos) => {
            for (const todo of todos) insert.run(todo.task, todo.completed);
          });
          insertMany(testData);
          console.log('Seeding test data into database');
        } else {
          console.warn('seedTestData called outside of test environment. FIXME!');

        }
      },


      getAllPlayers: () => {
        return database.prepare('SELECT * FROM players ORDER BY id DESC').all();
      },

      createPlayer: (name) => {
        const info = database.prepare('INSERT INTO players (name) VALUES (?)').run(task);
        return info.lastInsertRowid; // todo
      },

      getAllTodos: () => {
        return database.prepare('SELECT * FROM todos ORDER BY id DESC').all();
      },

      getTodoById: (id) => {
        return database.prepare('SELECT * FROM todos WHERE id = ?').get(id);
      },

      createTodo: (task) => {
        const info = database.prepare('INSERT INTO todos (task) VALUES (?)').run(task);
        return info.lastInsertRowid;
      },

      updateTodo: (id, task, completed) => {
        const info = database.prepare('UPDATE todos SET task = ?, completed = ? WHERE id = ?')
          .run(task, completed ? 1 : 0, id);
        return info.changes;
      },

      deleteTodo: (id) => {
        const info = database.prepare('DELETE FROM todos WHERE id = ?').run(id);
        return info.changes;
      },

      toggleTodo: (id) => {
        const info = database.prepare('UPDATE todos SET completed = NOT completed WHERE id = ?').run(id);
        return info.changes;
      },
      getTotalTodos: () => {
        return database.prepare('SELECT COUNT(*) AS c FROM todos').get().c;
      },

      getCompletedTodos: () => {
        return database.prepare('SELECT COUNT(*) AS c FROM todos WHERE completed > 0').get().c;
      },
    }
  };
}


module.exports = {
  createDatabaseManager,
};
