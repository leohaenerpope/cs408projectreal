import { test, expect } from '@playwright/test';
import { createDatabaseManager } from '../src/bin/db';
import path from 'path';

const testDbPath = path.join(__dirname, '../test-data/test-database.sqlite');

// Simple database tests using the testSeedDatabase function from db.js
test.describe('Players Database Tests', () => {
    let dbManager;

    // 
    test.beforeEach(() => {
        // Create the test database
        dbManager = createDatabaseManager(testDbPath).dbHelpers;

        // clear and seed database
        dbManager.clearDatabase();
        dbManager.testSeedDatabase();
    })

    // database contains players
    test('testSeedDatabase functionality: adding correct players', async () => {
        const players = dbManager.getAllPlayers();
    
        const playerNames = players.map(p => p.name);
        expect(playerNames).toContain('LeBron James');
        expect(playerNames).toContain('Stephen Curry');
    
        console.log('All seeded players:', playerNames);
    });

    // clearDatabase functionality
    test('clearDatabase functionality: empties the database', async () => {
        dbManager.clearDatabase();
        const players = dbManager.getAllPlayers();
        expect(players.length).toBe(0);
    });
  });
  