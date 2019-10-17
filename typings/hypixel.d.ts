/* eslint-disable camelcase */

declare module 'Hypixel-API' {
  interface Player {
    _id: string;
    achievements: {
      arcade_arcade_banker: number;
      arcade_arcade_winner: number;
      arcade_bounty_hunter: number;
      arcade_farmhunt_dominator: number;
      arcade_football_pro: number;
      arcade_hide_and_seek_hider_kills: number;
      arcade_miniwalls_winner: number;
      arcade_team_work: number;
      arcade_zombie_killer: number;
      arcade_zombies_high_round: number;
      arcade_zombies_nice_shot: number;
      arcade_zombies_round_progression: number;
      arena_climb_the_ranks: number;
      bedwars_beds: number;
      bedwars_bedwars_killer: number;
      bedwars_collectors_edition: number;
      bedwars_level: number;
      bedwars_loot_box: number;
      bedwars_wins: number;
      blitz_coins: number;
      blitz_kills: number;
      blitz_kit_expert: number;
      blitz_looter: number;
      blitz_treasure_seeker: number;
      blitz_war_veteran: number;
      blitz_wins: number;
      blitz_wins_teams: number;
      bridge_four_teams_wins: number;
      bridge_four_v_four_wins: number;
      bridge_goals: number;
      bridge_one_v_one_wins: number;
      bridge_two_v_two_wins: number;
      bridge_unique_map_wins: number;
      bridge_win_streak: number;
      bridge_wins: number;
      buildbattle_build_battle_points: number;
      buildbattle_build_battle_score: number;
      buildbattle_build_battle_voter: number;
      buildbattle_guess_the_build_guesses: number;
      christmas2017_advent: number;
      christmas2017_advent_2018: number;
      christmas2017_no_christmas: number;
      christmas2017_santa_says_rounds: number;
      copsandcrims_bomb_specialist: number;
      copsandcrims_cac_banker: number;
      copsandcrims_headshot_kills: number;
      copsandcrims_serial_killer: number;
      copsandcrims_hero_terrorist: number;
      duels_bridge_doubles_wins: number;
      duels_bridge_duels_wins: number;
      duels_bridge_four_teams_wins: number;
      duels_bridge_teams_wins: number;
      duels_bridge_win_streak: number;
      duels_bridge_wins: number;
      duels_duels_division: number;
      duels_duels_traveller: number;
      duels_duels_trophies: number;
      duels_duels_win_streak: number;
      duels_duels_winner: number;
      duels_goals: number;
      duels_unique_map_wins: number;
      easter_throw_eggs: number;
      general_challenger: number;
      general_coins: number;
      general_quest_master: number;
      general_wins: number;
      gingerbread_banker: number;
      gingerbread_mystery: number;
      gingerbread_racer: number;
      gingerbread_winner: number;
      halloween2017_pumpkin_smasher: number;
      halloween2017_pumpkinator: number;
      murdermystery_hoarder: number;
      murdermystery_kills_as_murderer: number;
      murdermystery_wins_as_murderer: number;
      murdermystery_wins_as_survivor: number;
      paintball_kills: number;
      paintball_wins: number;
      quake_coins: number;
      quake_headshots: number;
      quake_kills: number;
      skyblock_angler: number;
      skyblock_augmentation: number;
      skyblock_combat: number;
      skyblock_concoctor: number;
      skyblock_excavator: number;
      skyblock_gatherer: number;
      skyblock_harvester: number;
      skyblock_minion_lover: number;
      skyblock_treasury: number;
      skyclash_cards_unlocked: number;
      skywars_cages: number;
      skywars_heads: number;
      skywars_kills_mega: number;
      skywars_kills_solo: number;
      skywars_kills_team: number;
      skywars_kits_mega: number;
      skywars_kits_solo: number;
      skywars_kits_team: number;
      skywars_wins_lab: number;
      skywars_wins_mega: number;
      skywars_wins_solo: number;
      skywars_wins_team: number;
      speeduhc_hunter: number;
      speeduhc_promotion: number;
      speeduhc_uhc_master: number;
      supersmash_handyman: number;
      supersmash_hero_slayer: number;
      supersmash_smash_champion: number;
      supersmash_smash_winner: number;
      tntgames_block_runner: number;
      tntgames_bow_spleef_wins: number;
      tntgames_clinic: number;
      tntgames_pvp_run_killer: number;
      tntgames_pvp_run_wins: number;
      tntgames_tnt_banker: number;
      tntgames_tnt_run_wins: number;
      tntgames_tnt_tag_wins: number;
      tntgames_tnt_triathlon: number;
      tntgames_tnt_wizards_caps: number;
      tntgames_tnt_wizards_kills: number;
      tntgames_wizards_wins: number;
      uhc_bounty: number;
      uhc_champion: number;
      uhc_consumer: number;
      uhc_hunter: number;
      uhc_moving_up: number;
      uhc_ultimatum: number;
      vampirez_zombie_killer: number;
      walls_coins: number;
      walls_kills: number;
      walls3_coins: number;
      walls3_guardian: number;
      walls3_jack_of_all_trades: number;
      walls3_kills: number;
      walls3_rusher: number;
      walls3_wins: number;
      warlords_mage_level: number;
      warlords_paladin_level: number;
      warlords_shaman_level: number;
      warlords_warrior_level: number;
    };
    achievementsOneTime: string[];
    achievementPoints: number;
    achievementRewardsNew: {};
    achievementSync: {
      quake_tiered: number;
    };
    achievementTotem: {
      allowed_max_height: number;
      canCustomize: boolean;
      selectedColors: {};
      selectedParts: {};
      unlockedColors: Array;
      unlockedParts: Array;
    };
    achievementTracking: Array;
    adsense_tokens: number;
    challenges: {
      all_time: {};
      day_a: {};
      day_b: {};
      day_g: {};
      day_h: {};
      day_i: {};
      day_j: {};
      day_k: {};
      day_l: {};
    };
    channel: string;
    completed_christmas_quests_2017?: number;
    completed_christmas_quests_2018?: number;
    completed_christmas_quests_2019?: number;
    currentGadget: string;
    displayname: string;
    eugene: {
      dailyTwoKExp: number;
    };
    firstLogin: number;
    fortuneBuff: number;
    friendRequestsUuid: Array;
    giftingMeta: {
      bundlesGiven: number;
      bundlesReceived: number;
      giftsGiven: number;
      milestones: Array;
      realBundlesGiven: number;
      realBundlesReceived: number;
    };
    housingMeta: {
      allowedBlocks: Array;
      firstHouseJoinMs: number;
      packages: Array;
      playerSettings: {};
      tutorialStep: string;
    };
    karma: number;
    knownAliases: string[];
    knownAliasesLower: string[];
    lastAdsenseGenerateTime: number;
    lastClaimedReward: number;
    lastLogin: number;
    lastLogout: number;
    levelUp_MVP?: number;
    levelUp_MVP_PLUS?: number;
    levelUp_VIP?: number;
    levelUp_VIP_PLUS?: number;
    mcVersionRp: string;
    monthlycrates: { [ key: string ]: {} };
    mostRecentGameType: string;
    networkExp: number;
    network_update_book: string;
    newPackageRank: string;
    outfit: {
      BOOTS: string;
      CHESTPLATE: string;
      HELMET: string;
      LEGGINGS: string;
    };
    parkourCheckpointBests: {};
    particlePack: string;
    petConsumables: {
      APPLE: number;
      BAKED_POTATO: number;
      BONE: number;
      BREAD: number;
      CAKE: number;
      CARROT_ITEM: number;
      COOKED_BEEF: number;
      COOKIE: number;
      FEATHER: number;
      GOLD_RECORD: number;
      HAY_BLOCK: number;
      LAVA_BUCKET: number;
      LEASH: number;
      MAGMA_CREAM: number;
      MELON: number;
      MILK_BUCKET: number;
      MUSHROOM_SOUP: number;
      PORK: number;
      PUMPKIN_PIE: number;
      RAW_FISH: number;
      RED_ROSE: number;
      ROTTEN_FLESH: number;
      SLIME_BALL: number;
      STICK: number;
      WATER_BUCKET: number;
      WHEAT: number;
      WOOD_SWORD: number;
    };
    petJourneyTimestamp: number;
    petStats: {};
    playername: string;
    quests: {
      arcade_gamer: {};
      arcade_specialist: {};
      arcade_winner: {};
      arena_daily_kills: {};
      arena_daily_play: {};
      arena_daily_wins: {};
      arena_weekly_play: {};
      bedwars_daily_gifts: {};
      bedwars_daily_nightmares: {};
      bedwars_daily_one_more: {};
      bedwars_daily_win: {};
      bedwars_weekly_bed_elims: {};
      bedwars_weekly_pumpkinator: {};
      bedwars_weekly_santa: {};
      blitz_game_of_the_day: {};
      blitz_kills: {};
      blitz_special_daily_north_pole: {};
      blitz_weekly_master: {};
      blitz_win: {};
      build_battle_christmas: {};
      build_battle_player: {};
      build_battle_weekly: {};
      build_battle_winner: {};
      crazy_walls_daily_kill: {};
      crazy_walls_daily_play: {};
      crazy_walls_daily_win: {};
      crazy_walls_weekly: {};
      cvc_kill: {};
      cvc_kill_daily_normal: {};
      cvc_kill_weekly: {};
      cvc_win_daily_deathmatch: {};
      cvc_win_daily_normal: {};
      duels_killer: {};
      duels_player: {};
      duels_weekly_kills: {};
      duels_weekly_wins: {};
      duels_winner: {};
      gingerbread_bling_bling: {};
      gingerbread_maps: {};
      gingerbread_mastery: {};
      gingerbread_racer: {};
      insane_brawler: {};
      mega_walls_faithful: {};
      mega_walls_kill: {};
      mega_walls_play: {};
      mega_walls_weekly: {};
      mega_walls_win: {};
      mm_daily_power_play: {};
      mm_daily_target_kill: {};
      mm_daily_win: {};
      mm_special_weekly_santa: {};
      mm_weekly_murderer_kills: {};
      mm_weekly_wins: {};
      normal_brawler: {};
      paintball_expert: {};
      paintball_killer: {};
      paintballer: {};
      prototype_pit_daily_contract: {};
      prototype_pit_daily_kills: {};
      prototype_pit_weekly_gold: {};
      quake_daily_kill: {};
      quake_daily_play: {};
      quake_daily_win: {};
      quake_weekly_play: {};
      skyclash_kills: {};
      skyclash_play_points: {};
      skyclash_play_games: {};
      skyclash_void: {};
      skyclash_weekly_kills: {};
      skywars_arcade_win: {};
      skywars_corrupt_win: {};
      skywars_daily_tokens: {};
      skywars_halloween_harvest: {};
      skywars_halloween_harvest_2019: {};
      skywars_mega_doubles_wins: {};
      skywars_solo_kills: {};
      skywars_solo_win: {};
      skywars_special_north_pole: {};
      skywars_team_kills: {};
      skywars_team_win: {};
      skywars_weekly_arcade_win_all: {};
      skywars_weekly_dream_win: {};
      skywars_weekly_free_loot_chest: {};
      skywars_weekly_hard_chest: {};
      skywars_weekly_kills: {};
      solo_brawler: {};
      supersmash_solo_kills: {};
      supersmash_solo_win: {};
      supersmash_team_kills: {};
      supersmash_team_win: {};
      supersmash_weekly_kills: {};
      team_brawler: {};
      tnt_bowspleef_daily: {};
      tnt_bowspleef_weekly: {};
      tnt_daily_win: {};
      tnt_pvprun_daily: {};
      tnt_pvprun_weekly: {};
      tnt_tntrun_daily: {};
      tnt_tntrun_weekly: {};
      tnt_tnttag_daily: {};
      tnt_tnttag_weekly: {};
      tnt_weekly_play: {};
      tnt_wizards_daily: {};
      tnt_wizards_weekly: {};
      uhc_addict: {};
      uhc_dm: {};
      uhc_madness: {};
      uhc_solo: {};
      uhc_team: {};
      uhc_weekly: {};
      uhc_weekly_special_cookie: {};
      vampirez_daily_human_kill: {};
      vampirez_daily_kill: {};
      vampirez_daily_play: {};
      vampirez_daily_win: {};
      vampirez_weekly_human_kill: {};
      vampirez_weekly_kill: {};
      vampirez_weekly_win: {};
      walls_daily_kill: {};
      walls_daily_play: {};
      walls_daily_win: {};
      walls_weekly: {};
      warlords_all_star: {};
      warlords_ctf: {};
      warlords_dedication: {};
      warlords_domination: {};
      warlords_objectives: {};
      warlords_tdm: {};
      warlords_victorious: {};
    };
    questSettings: {
      autoActivate: boolean;
    };
    quickjoin_timestamp: number;
    quickjoin_uses: number;
    parkourCompletions: {
      Bedwars: Array;
      BlitzLobby: Array;
      Duels: Array;
      MurderMystery: Array;
      Prototype: Array;
      SkywarsAug2017: Array;
      SpeedUHC: Array;
      uhc: Array;
    };
    rankPlusColor?: string;
    rewardHighScore: number;
    rewardScore: number;
    rewardStreak: number;
    settings: {
      autoSpawnPet: boolean;
      bridgeChallengePrivacy: string;
      combatTracker: boolean;
      duelInvitePrivacy: string;
      friendRequestPrivacy: string;
      guildInvitePrivacy: string;
      particleQuality: string;
      partyInvitePrivacy: string;
      petVisibility: boolean;
      playerVisibility: boolean;
    };
    socialMedia: {
      links: {};
      prompt: boolean;
    };
    stats: {
      Arcade: {};
      Arena: {};
      Battleground: {};
      Bedwars: {};
      BuildBattle: {};
      Duels: {};
      GingerBread: {};
      HungerGames: {};
      Legacy: {};
      MCGO: {};
      MurderMystery: {};
      Paintball: {};
      Pit: {};
      Quake: {};
      SkyBlock: {};
      SkyClash: {};
      SkyWars: {};
      SpeedUHC: {};
      SuperSmash: {};
      TNTGames: {};
      TrueCombat: {};
      UHC: {};
      VampireZ: {};
      Walls: {};
      Walls3: {};
    };
    totalDailyRewards: number;
    totalRewards: number;
    tourney: {
      bedwars4s_0: {};
      blitz_duo_0: {};
      first_join_lobby: number;
      sw_crazy_solo_0: {};
      total_tributes: number;
    };
    uuid: string;
    vanityFavorites: string;
    vanityMeta: {
      packages: Array;
    };
    voting: {
      last_mcf: number;
      last_mcsl: number;
      last_mcsorg: number;
      last_vote: number;
      secondary_mcf: number;
      secondary_mcsl: number;
      secondary_mcsorg: number;
      total: number;
      total_mcf: number;
      total_mcsl: number;
      total_mcsorg: number;
      votesToday: number;
    };
  }
}
