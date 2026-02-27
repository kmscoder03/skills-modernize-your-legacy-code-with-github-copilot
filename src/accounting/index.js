/**
 * DATA LAYER - Corresponds to DataProgram in COBOL
 * Manages account balance persistence and retrieval
 */
export class DataModule {
  constructor() {
    // STORAGE-BALANCE: PIC 9(6)V99 VALUE 1000.00
    this.storageBalance = 1000.00;
  }

  /**
   * READ Operation: Retrieves current account balance
   * @returns {number} Current balance
   */
  read() {
    return this.storageBalance;
  }

  /**
   * WRITE Operation: Updates account balance
   * @param {number} newBalance - New balance to persist
   */
  write(newBalance) {
    this.storageBalance = newBalance;
  }

  /**
   * Get current balance formatted to 2 decimal places
   * @returns {string} Formatted balance
   */
  getFormattedBalance() {
    return this.storageBalance.toFixed(2);
  }
}

/**
 * OPERATIONS LAYER - Corresponds to Operations module in COBOL
 * Implements business logic for account operations
 */
export class OperationsModule {
  constructor(dataModule) {
    this.dataModule = dataModule;
  }

  /**
   * TOTAL Operation: View current account balance
   * Equivalent to: OPERATION-TYPE = 'TOTAL'
   */
  async viewBalance() {
    const currentBalance = this.dataModule.read();
    console.log(`\nCurrent balance: ${currentBalance.toFixed(2)}`);
    return currentBalance;
  }

  /**
   * CREDIT Operation: Add funds to student account
   * Equivalent to: OPERATION-TYPE = 'CREDIT'
   * Process:
   *   1. Prompt user to enter credit amount
   *   2. Read current balance from DataModule
   *   3. Add the credit amount to the balance
   *   4. Write updated balance back to DataModule
   *   5. Display confirmation with new balance
   */
  async creditAccount(amount) {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      throw new Error('Amount must be a positive number');
    }

    let finalBalance = this.dataModule.read();
    finalBalance = parseFloat((finalBalance + parsedAmount).toFixed(2));
    this.dataModule.write(finalBalance);

    console.log(`\nAmount credited. New balance: ${finalBalance.toFixed(2)}`);
    return finalBalance;
  }

  /**
   * DEBIT Operation: Subtract funds from student account
   * Equivalent to: OPERATION-TYPE = 'DEBIT'
   * Process:
   *   1. Prompt user to enter debit amount
   *   2. Read current balance from DataModule
   *   3. Validate that sufficient funds exist
   *   4. If valid: Subtract amount and write new balance
   *   5. If invalid: Display insufficient funds message without processing
   * Business Rule: Overdraft prevention - prevents negative balance
   */
  async debitAccount(amount) {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      throw new Error('Amount must be a positive number');
    }

    let finalBalance = this.dataModule.read();

    // Overdraft Prevention: IF FINAL-BALANCE >= AMOUNT
    if (finalBalance >= parsedAmount) {
      finalBalance = parseFloat((finalBalance - parsedAmount).toFixed(2));
      this.dataModule.write(finalBalance);
      console.log(`\nAmount debited. New balance: ${finalBalance.toFixed(2)}`);
      return { success: true, newBalance: finalBalance };
    } else {
      // Insufficient Funds: Display error without modifying balance
      console.log('\nInsufficient funds for this debit.');
      return { success: false, newBalance: finalBalance };
    }
  }
}

/**
 * MAIN PROGRAM - Corresponds to MainProgram in COBOL
 * Menu-driven user interface and program orchestration
 * 
 * Business Rules:
 * - System runs in continuous loop until user selects exit (option 4)
 * - Invalid menu choices display error and prompt for re-entry
 * - Each user action calls Operations module to perform business logic
 */
export class MainProgram {
  constructor() {
    this.dataModule = new DataModule();
    this.operationsModule = new OperationsModule(this.dataModule);
    this.continueFlag = true;
  }

  /**
   * Display main menu
   */
  displayMenu() {
    console.log('\n--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');
  }

  /**
   * Display startup banner
   */
  displayBanner() {
    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║  Student Account Management System - Node.js v1.0  ║');
    console.log('║  Modernized from Legacy COBOL Application          ║');
    console.log('╚════════════════════════════════════════════════════╝');
  }

  /**
   * Validate user choice
   * @param {number} choice - User selection
   * @returns {boolean} True if choice is valid (1-4)
   */
  isValidChoice(choice) {
    return choice >= 1 && choice <= 4;
  }

  /**
   * Process user menu selection
   * Equivalent to: EVALUATE USER-CHOICE
   */
  async processUserChoice(choice) {
    switch (choice) {
      case 1:
        // WHEN 1: CALL 'Operations' USING 'TOTAL'
        await this.operationsModule.viewBalance();
        break;
      case 2:
        // WHEN 2: CALL 'Operations' USING 'CREDIT'
        await this.operationsModule.creditAccount();
        break;
      case 3:
        // WHEN 3: CALL 'Operations' USING 'DEBIT'
        await this.operationsModule.debitAccount();
        break;
      case 4:
        // WHEN 4: MOVE 'NO' TO CONTINUE-FLAG
        console.log('Exiting the program. Goodbye!\n');
        this.continueFlag = false;
        break;
      default:
        console.log('Invalid choice, please select 1-4.');
    }
  }

  /**
   * Main program loop
   * Equivalent to: PERFORM UNTIL CONTINUE-FLAG = 'NO'
   */
  async run() {
    this.displayBanner();

    // For interactive mode - commented out for testing
    // PERFORM UNTIL CONTINUE-FLAG = 'NO'
    /*
    while (this.continueFlag) {
      this.displayMenu();

      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'choice',
          message: 'Enter your choice (1-4):',
          choices: [
            { name: '1. View Balance', value: 1 },
            { name: '2. Credit Account', value: 2 },
            { name: '3. Debit Account', value: 3 },
            { name: '4. Exit', value: 4 }
          ]
        }
      ]);

      await this.processUserChoice(answers.choice);
    }

    // Program termination
    // STOP RUN
    process.exit(0);
    */
  }
}

/**
 * Interactive Command-line Application Entry Point
 */
async function main() {
  try {
    const inquirer = (await import('inquirer')).default;
    
    const mainProgram = new MainProgram();
    mainProgram.displayBanner();

    let continueFlag = true;
    while (continueFlag) {
      mainProgram.displayMenu();

      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'choice',
          message: 'Enter your choice (1-4):',
          choices: [
            { name: '1. View Balance', value: 1 },
            { name: '2. Credit Account', value: 2 },
            { name: '3. Debit Account', value: 3 },
            { name: '4. Exit', value: 4 }
          ]
        }
      ]);

      if (answers.choice === 1) {
        await mainProgram.operationsModule.viewBalance();
      } else if (answers.choice === 2) {
        const creditAnswers = await inquirer.prompt([
          {
            type: 'number',
            name: 'amount',
            message: 'Enter credit amount:',
            default: 0,
            validate(value) {
              if (isNaN(value)) {
                return 'Please enter a valid number';
              }
              if (value < 0) {
                return 'Amount cannot be negative';
              }
              return true;
            }
          }
        ]);
        await mainProgram.operationsModule.creditAccount(creditAnswers.amount);
      } else if (answers.choice === 3) {
        const debitAnswers = await inquirer.prompt([
          {
            type: 'number',
            name: 'amount',
            message: 'Enter debit amount:',
            default: 0,
            validate(value) {
              if (isNaN(value)) {
                return 'Please enter a valid number';
              }
              if (value < 0) {
                return 'Amount cannot be negative';
              }
              return true;
            }
          }
        ]);
        await mainProgram.operationsModule.debitAccount(debitAnswers.amount);
      } else if (answers.choice === 4) {
        console.log('Exiting the program. Goodbye!\n');
        continueFlag = false;
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('An error occurred:', error.message);
    process.exit(1);
  }
}

// Start the application if running as main module
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
