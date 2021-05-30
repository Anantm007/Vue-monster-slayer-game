// Creating the vue app
const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
      logMessages: [],
    };
  },
  // Kindof setters
  computed: {
    monsterBarStyles() {
      if (this.monsterHealth <= 0) {
        return { width: "0%" };
      }

      return { width: this.monsterHealth + "%" };
    },

    playerBarStyles() {
      if (this.playerHealth <= 0) {
        return { width: "0%" };
      }

      return { width: this.playerHealth + "%" };
    },

    useSpecialAttack() {
      return this.currentRound % 3 !== 0;
    },
  },
  watch: {
    // The property's exact name
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        // A draw
        this.winner = "draw";
      } else if (value <= 0) {
        // Player lost
        this.winner = "monster";
      }
    },

    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        // A draw
        this.winner = "draw";
      } else if (value <= 0) {
        // Monster lost
        this.winner = "player";
      }
    },
  },
  methods: {
    // Start over a new game
    async startGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.winner = null;
      this.currentRound = 0;
      this.logMessages = [];
    },

    // When player attacks the monster by clicking the Attack button
    async attackMonster() {
      // Reduce monster's health by player's attack
      const attackValue = await getRandomValue(5, 12);
      this.monsterHealth -= attackValue;

      // Monster should also attack back
      this.attackPlayer();

      // Add log message
      this.addLogMessage("player", "attack", attackValue);

      // Number of rounds increased
      this.currentRound++;
    },

    // When monster attacks the player
    async attackPlayer() {
      const attackValue = await getRandomValue(8, 15);
      this.playerHealth -= attackValue;

      // Add log message
      this.addLogMessage("monster", "attack", attackValue);
    },

    // More damage to the monster when player clicks Special Attack button
    async specialAttackMonster() {
      const attackValue = await getRandomValue(10, 25);
      this.monsterHealth -= attackValue;

      this.attackPlayer();

      this.addLogMessage("player", "special-attack", attackValue);

      this.currentRound++;
    },

    // Heal user's health when Heal button is pressed
    async healPlayer() {
      const healValue = await getRandomValue(8, 20);

      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healValue;
      }

      this.currentRound++;

      this.addLogMessage("player", "heals", healValue);

      this.attackPlayer();
    },

    // Surrender the game
    async surrender() {
      this.winner = "monster";
    },

    // Game logs
    async addLogMessage(who, what, value) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
  },
});

app.mount("#game");

// Helper function, returns a value in the range [min, max]
const getRandomValue = async (max, min) => {
  return Math.floor(Math.random() * (max - min)) + min;
};
