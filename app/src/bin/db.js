const Database = require('better-sqlite3');

const createTodosTableSQL = `
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task TEXT NOT NULL,
    completed INTEGER DEFAULT 0
  )`;
const createPlayersTableSQL = `
  CREATE TABLE IF NOT EXISTS players (
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
    points INTEGER,
    assists INTEGER,
    rebounds INTEGER,
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
          database.prepare('DELETE FROM players').run();
          database.prepare('DELETE FROM matchup_notes').run();
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

      getPlayerById: (id) => {
        return database.prepare('SELECT * FROM players WHERE id = ?').get(id);
      },

      createPlayer: (name) => {
        if (name.toLowerCase() === 'everyone') {
          throw new Error('You cannot add a player named: everyone')
        }
        const stmt = database.prepare('INSERT INTO players (name) VALUES (?)')
        const info = stmt.run(name);
        return database.prepare('SELECT * FROM players WHERE id = ?').get(info.lastInsertRowid);
      },

      // no update player functionality for project
      // may add layer just for updating name, however not necessary right now

      deletePlayer: (id) => {
        const info = database.prepare('DELETE FROM players WHERE id = ?').run(id);
        return info.changes;
      },

      getTotalPlayers: () => {
        return database.prepare('SELECT COUNT(*) AS c FROM players').get().c;
      },

      // Player Matchup Notes ------------------------------

      getAllPlayerMatchupNotes: (playerId) => {
        const sql = `
        SELECT m.*, p.name AS opponent_name
        FROM matchup_notes m
        JOIN players p ON m.opponent_id = p.id
        WHERE m.player_id = ?
        ORDER BY m.matchup_date DESC
        `;
        return database.prepare(sql).all(playerId);
      },

      createMatchupNote: (note) => {
        const {playerId, opponentId, notes, matchup_date, points, assists, rebounds} = note;
        const sql = `
        INSERT INTO matchup_notes
        (player_id, opponent_id, notes, matchup_date, points, assists, rebounds)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const info = database.prepare(sql).run(
          playerId, opponentId, notes, matchup_date, points, assists, rebounds
        );
        return info.lastInsertRowid;
      },

      updateMatchupNote: (id, note) => {
        const existing = database.prepare('SELECT * FROM matchup_notes WHERE id = ?').get(id);
        if (!existing) return 0;

        const realData = {...existing, ...note}

        const info = database.prepare(
          'UPDATE matchup_notes SET notes = ?, matchup_date = ?, points = ?, assists = ?, rebounds = ? WHERE id = ?'
        ).run(
          realData.notes,
          realData.matchup_date,
          realData.points,
          realData.assists,
          realData.rebounds,
          id);
        return info.changes
      },

      deleteMatchupNote: (id) => {
        const info = database.prepare('DELETE FROM matchup_notes WHERE id = ?').run(id);
        return info.changes;
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
