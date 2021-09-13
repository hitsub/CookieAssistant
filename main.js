if(CookieAssistant === undefined)
{
	var CookieAssistant = {};
}
if(typeof CCSE == 'undefined')
{
	Game.LoadMod('https://klattmose.github.io/CookieClicker/SteamMods/CCSE/main.js');
}

CookieAssistant.name = 'Cookie Assistant';
CookieAssistant.version = '0.3.0';
CookieAssistant.GameVersion = '2.042';


CookieAssistant.launch = function()
{
	CookieAssistant.defaultConfig = function()
	{
		var conf = 
		{
			//各機能の有効/無効のフラグ
			flags:
			{
				autoClickBigCookie: 0,
				autoClickGoldenCookie: 0,
				autoClickReindeer: 0,
				autoClickFortuneNews: 0,
				autoClickWrinklers: 0,
				autoSpellonBuff: 0,
				autoBuyElderPledge: 0,
				autoBuyUpgrades: 0,
				autoBuyBuildings: 0,
				autoSwitchSeason: 0,
				autoTrainDragon : 0,
				autoSetSpirits : 0,
			},
			//各機能の実行間隔
			intervals:
			{
				autoClickBigCookie: 1,
				autoClickGoldenCookie: 1,
				autoClickReindeer: 100,
				autoClickFortuneNews: 100,
				autoClickWrinklers: 60000,
				autoSpellonBuff: 1000,
				autoBuyElderPledge: 1000,
				autoBuyUpgrades: 1000,
				autoBuyBuildings: 1000,
				autoSwitchSeason: 1000,
				autoTrainDragon : 1000,
				autoSetSpirits : 10000,
			},
			//各機能の特殊設定
			particular:
			{
				dragon:
				{
					aura1: 0,
					aura2: 0,
				},
				spell:
				{
					mode: 0,
				},
				upgrades:
				{
					mode: 0,
				},
				buildings:
				{
					mode: 0,
				},
				spirits:
				{
					slot1: 0,
					slot2: 1,
					slot3: 2,
				},
			}
		};

		return conf;
	}

	CookieAssistant.init = function()
	{
		CookieAssistant.isLoaded = 1;
		CookieAssistant.restoreDefaultConfig(1);
		CookieAssistant.ReplaceGameMenu();

		CookieAssistant.intervalHandles = 
		{
			autoClickBigCookie: null,
			autoClickGoldenCookie: null,
			autoClickReindeer: null,
			autoClickFortuneNews: null,
			autoClickWrinklers: null,
			autoSpellonBuff: null,
			autoBuyElderPledge: null,
			autoBuyUpgrades: null,
			autoBuyBuildings: null,
			autoSwitchSeason: null,
			autoTrainDragon : null,
			autoSetSpirits : null,
		}

		CookieAssistant.modes =
		{
			spell:
			{
				0:
				{
					desc: "When the minimum required MP has been accumulated / 最低限必要なMPが溜まったら詠唱",
				},
				1:
				{
					desc: "When MP is fully restored / MPが完全回復したら詠唱",
				}
			},
			upgrades:
			{
				0:
				{
					desc: "All Upgrades (includes Researches) / 全てのアップグレード(研究を含む)",
				},
				1:
				{
					desc: "All Upgrades except Researches / 研究を除く全てのアップグレード",
				},
				2:
				{
					desc: `All Upgrades that don't cause "Grandmapocalypse" / ババアポカリプスが起きない全てのアップグレード`,
				},
			},
			buildings:
			{
				0:
				{
					amount: 10,
					desc: "Buy every 10 pieces",
				},
				1:
				{
					amount: 50,
					desc: "Buy every 50 pieces",
				},
				2:
				{
					amount: 100,
					desc: "Buy every 100 pieces",
				},
			},
		}

		CookieAssistant.actions =
		{
			autoClickBigCookie: () =>
			{
				CookieAssistant.intervalHandles.autoClickBigCookie = setInterval(
					() =>
					{
						bigCookie.click();
						Game.lastClick = 0;
					},
					CookieAssistant.config.intervals.autoClickBigCookie
				)
			},
			autoClickGoldenCookie: () =>
			{
				CookieAssistant.intervalHandles.autoClickGoldenCookie = setInterval(
					() =>
					{
						for (var i in Game.shimmers)
						{
							if(Game.shimmers[i].type == "golden")
							{
								Game.shimmers[i].pop();
							}
						}
					},
					CookieAssistant.config.intervals.autoClickGoldenCookie
				)
			},
			autoClickReindeer: () =>
			{
				CookieAssistant.intervalHandles.autoClickReindeer = setInterval(
					() =>
					{
						for (var i in Game.shimmers)
						{
							if(Game.shimmers[i].type == "reindeer")
							{
								Game.shimmers[i].pop();
							}
						}
					},
					CookieAssistant.config.intervals.autoClickReindeer
				)
			},
			autoClickFortuneNews: () =>
			{
				CookieAssistant.intervalHandles.autoClickFortuneNews = setInterval(
					() =>
					{
						if (Game.TickerEffect && Game.TickerEffect.type == 'fortune')
						{
							Game.tickerL.click();
						}
					},
					CookieAssistant.config.intervals.autoClickFortuneNews
				)
			},
			autoSpellonBuff: () =>
			{
				CookieAssistant.intervalHandles.autoSpellonBuff = setInterval(
					() =>
					{
						var isFrenzy = false;
						for (var i in Game.buffs)
						{
							if (Game.buffs[i].name == "Frenzy")
							{
								isFrenzy = true;
							}
						}
						var grimoire = Game.ObjectsById[7].minigame;
						var spell = grimoire.spells['hand of fate'];
						var cost = 0;
						switch(CookieAssistant.config.particular.spell.mode)
						{
							case 0: //必要最低限のMP
								cost = Math.floor(spell.costMin + grimoire.magicM * spell.costPercent);
								break;
							case 1: //MP完全回復
							default:
								cost = grimoire.magicM;
								break;
						}
						if (cost <= Math.floor(grimoire.magic) && isFrenzy)
						{
							grimoire.castSpell(spell);
						}
					},
					CookieAssistant.config.intervals.autoSpellonBuff
				)
			},
			autoClickWrinklers: () =>
			{
				CookieAssistant.intervalHandles.autoClickWrinklers = setInterval(
					() =>
					{
						Game.wrinklers.forEach(function(me){ if (me.close==1) me.hp = 0});
					},
					CookieAssistant.config.intervals.autoClickWrinklers
				)
			},
			autoBuyElderPledge: () =>
			{
				CookieAssistant.intervalHandles.autoBuyElderPledge = setInterval(
					() =>
					{
						if (Game.UpgradesInStore.indexOf(Game.Upgrades["Elder Pledge"]) != -1)
						{
							Game.Upgrades["Elder Pledge"].buy();
						}
						//ElderPledgeを自動購入してるんだったら生贄用めん棒も買ってほしいはずなのでこっちでも見る
						if (Game.UpgradesInStore.indexOf(Game.Upgrades["Sacrificial rolling pins"]) != -1)
						{
							Game.Upgrades["Sacrificial rolling pins"].buy(1);
						}
					},
					CookieAssistant.config.intervals.autoBuyElderPledge
				)
			},
			autoBuyUpgrades: () =>
			{
				CookieAssistant.intervalHandles.autoBuyUpgrades = setInterval(
					() =>
					{
						for (var i in Game.UpgradesInStore)
						{
							var upgrade = Game.UpgradesInStore[i];
							//スイッチ類を除いて購入(ElderPledgeもToggle扱いなので考えなくてよい)
							//生贄用めん棒はこっちでも勝手に買われる
							if (upgrade.pool != "toggle")
							{
								//研究を除くモードの時
								if (CookieAssistant.config.particular.upgrades.mode == 1 && upgrade.pool == "tech")
								{
									continue;
								}
								//ババアポカリプスに入りたくないモードの時
								if (CookieAssistant.config.particular.upgrades.mode == 2 && upgrade.name == "One mind")
								{
									continue;
								}
								upgrade.buy(1);
							}
						}
					},
					CookieAssistant.config.intervals.autoBuyUpgrades
				);
			},
			autoSwitchSeason: () =>
			{
				CookieAssistant.intervalHandles.autoSwitchSeason = setInterval(
					() =>
					{
						var winterSantaRate = Game.GetHowManySantaDrops() / Game.santaDrops.length;
						var winterReindeerRate = Game.GetHowManyReindeerDrops() / Game.reindeerDrops.length;
						var halloweenRate = Game.GetHowManyHalloweenDrops() / Game.halloweenDrops.length;
						var easterRate = Game.GetHowManyEggs() / Game.easterEggs.length;
						var valentinesRate = Game.GetHowManyHeartDrops() / Game.heartDrops.length;

						// Game.Upgrades['Festive biscuit'].descFunc=function(){return '<div style="text-align:center;">'+Game.listTinyOwnedUpgrades(Game.santaDrops)+'<br><br>'+(EN?('You\'ve purchased <b>'+Game.GetHowManySantaDrops()+'/'+Game.santaDrops.length+'</b> of Santa\'s gifts.'):loc("Seasonal cookies purchased: <b>%1</b>.",Game.GetHowManySantaDrops()+'/'+Game.santaDrops.length))+'<div class="line"></div>'+Game.listTinyOwnedUpgrades(Game.reindeerDrops)+'<br><br>'+(EN?('You\'ve purchased <b>'+Game.GetHowManyReindeerDrops()+'/'+Game.reindeerDrops.length+'</b> reindeer cookies.'):loc("Reindeer cookies purchased: <b>%1</b>.",Game.GetHowManyReindeerDrops()+'/'+Game.reindeerDrops.length))+'<div class="line"></div>'+Game.saySeasonSwitchUses()+'<div class="line"></div></div>'+this.ddesc;};
						// Game.Upgrades['Bunny biscuit'].descFunc=function(){return '<div style="text-align:center;">'+Game.listTinyOwnedUpgrades(Game.easterEggs)+'<br><br>'+(EN?('You\'ve purchased <b>'+Game.GetHowManyEggs()+'/'+Game.easterEggs.length+'</b> eggs.'):loc("Eggs purchased: <b>%1</b>.",Game.GetHowManyEggs()+'/'+Game.easterEggs.length))+'<div class="line"></div>'+Game.saySeasonSwitchUses()+'<div class="line"></div></div>'+this.ddesc;};
						// Game.Upgrades['Ghostly biscuit'].descFunc=function(){return '<div style="text-align:center;">'+Game.listTinyOwnedUpgrades(Game.halloweenDrops)+'<br><br>'+(EN?('You\'ve purchased <b>'+Game.GetHowManyHalloweenDrops()+'/'+Game.halloweenDrops.length+'</b> halloween cookies.'):loc("Seasonal cookies purchased: <b>%1</b>.",Game.GetHowManyHalloweenDrops()+'/'+Game.halloweenDrops.length))+'<div class="line"></div>'+Game.saySeasonSwitchUses()+'<div class="line"></div></div>'+this.ddesc;};
						// Game.Upgrades['Lovesick biscuit'].descFunc=function(){return '<div style="text-align:center;">'+Game.listTinyOwnedUpgrades(Game.heartDrops)+'<br><br>'+(EN?('You\'ve purchased <b>'+Game.GetHowManyHeartDrops()+'/'+Game.heartDrops.length+'</b> heart biscuits.'):loc("Seasonal cookies purchased: <b>%1</b>.",Game.GetHowManyHeartDrops()+'/'+Game.heartDrops.length))+'<div class="line"></div>'+Game.saySeasonSwitchUses()+'<div class="line"></div></div>'+this.ddesc;};
						// Game.Upgrades['Fool\'s biscuit'].descFunc=function(){return '<div style="text-align:center;">'+Game.saySeasonSwitchUses()+'<div class="line"></div></div>'+this.ddesc;};

						// Game.seasons={
						// 	'christmas':{name:'Christmas',start:'Christmas season has started!',over:'Christmas season is over.',trigger:'Festive biscuit'},
						// 	'valentines':{name:'Valentine\'s day',start:'Valentine\'s day has started!',over:'Valentine\'s day is over.',trigger:'Lovesick biscuit'},
						// 	'fools':{name:'Business day',start:'Business day has started!',over:'Business day is over.',trigger:'Fool\'s biscuit'},
						// 	'easter':{name:'Easter',start:'Easter season has started!',over:'Easter season is over.',trigger:'Bunny biscuit'},
						// 	'halloween':{name:'Halloween',start:'Halloween has started!',over:'Halloween is over.',trigger:'Ghostly biscuit'}
						// };

						if (Game.season == "")
						{
							CookieAssistant.SwitchNextSeason();
						}
						else if (Game.season == "valentines")
						{
							if (valentinesRate >= 1)
							{
								// console.log("Complete Valentines");
								CookieAssistant.SwitchNextSeason();
							}
						}
						else if (Game.season == "christmas")
						{
							if (winterSantaRate < 1 || Game.santaLevel < 14)
							{
								Game.UpgradeSanta();
							}
							if (winterReindeerRate >= 1 && winterSantaRate >= 1 && Game.santaLevel >= 14)
							{
								// console.log("Complete Christmas");
								CookieAssistant.SwitchNextSeason();
							}
						}
						else if (Game.season == "easter")
						{
							if (easterRate >= 1)
							{
								// console.log("Complete Easter");
								CookieAssistant.SwitchNextSeason();
							}
						}
						else if (Game.season == "halloween")
						{
							//エルダー宣誓の自動購入がONのときは強制OFFにする
							if (CookieAssistant.config.flags.autoBuyElderPledge == 1)
							{
								CookieAssistant.config.flags.autoBuyElderPledge = 0;
								clearInterval(CookieAssistant.intervalHandles.autoBuyElderPledge);
								CookieAssistant.intervalHandles.autoBuyElderPledge = null;								
							}
							//エルダー宣誓の時間が残っている場合はエルダー誓約を発動する(エルダー宣誓の時間リセットのため)
							if (Game.pledgeT >= 1 && Game.UpgradesInStore.indexOf(Game.Upgrades["Elder Covenant"]) != -1)
							{
								// console.log("Buy Elder Covenant");
								Game.Upgrades["Elder Covenant"].buy();
							}
							//エルダー誓約の撤回が出来る場合はする（Wrinklerをスポーンさせる必要があるため）
							if (Game.UpgradesInStore.indexOf(Game.Upgrades["Revoke Elder Covenant"]) != -1)
							{
								// console.log("Buy Revoke Elder Covenant");
								Game.Upgrades["Revoke Elder Covenant"].buy();
							}
							if (halloweenRate >= 1)
							{
								// console.log("Complete Halloween");
								//エルダー誓約を購入してババアポカリプスを終了させてから次に行く
								Game.Upgrades["Elder Covenant"].buy(1);
								CookieAssistant.SwitchNextSeason();
							}
						}
					},
					CookieAssistant.config.intervals.autoSwitchSeason
				)
			},
			autoBuyBuildings: () =>
			{
				CookieAssistant.intervalHandles.autoBuyBuildings = setInterval(
					() =>
					{
						var amountPerPurchase = CookieAssistant.modes.buildings[CookieAssistant.config.particular.buildings.mode].amount;
						// console.log(l('products').innerHTML);
						for (const objectName in Game.Objects)
						{
							var amount = Game.Objects[objectName].amount % amountPerPurchase == 0 ? amountPerPurchase : amountPerPurchase - Game.Objects[objectName].amount % amountPerPurchase;
							var isMaxDragon = Game.dragonLevel >= Game.dragonLevels.length - 1;
							//ドラゴンの自動育成がONの場合は建物の自動購入を制限する
							if (!isMaxDragon && CookieAssistant.config.flags.autoTrainDragon && Game.Objects[objectName].amount >= 350 - amountPerPurchase)
							{
								amount = 350 - Game.Objects[objectName].amount;
								if (amount <= 0)
								{
									continue;
								}
							}
							if (Game.cookies >= Game.Objects[objectName].getSumPrice(amount))
							{
								Game.Objects[objectName].buy(amount);
							}
						}
					},
					CookieAssistant.config.intervals.autoBuyBuildings
				);
			},
			autoTrainDragon : () =>
			{
				CookieAssistant.intervalHandles.autoTrainDragon = setInterval(
					() =>
					{
						if (Game.dragonLevel < Game.dragonLevels.length - 1 && Game.dragonLevels[Game.dragonLevel].cost())
						{
							Game.UpgradeDragon();
							if (Game.dragonLevel == Game.dragonLevels.length - 1)
							{
								Game.dragonAura = CookieAssistant.config.particular.dragon.aura1;
								Game.dragonAura2 = CookieAssistant.config.particular.dragon.aura2;
							}
						}
					},
					CookieAssistant.config.intervals.autoTrainDragon
				);
			},
			autoSetSpirits : () =>
			{
				CookieAssistant.intervalHandles.autoSetSpirits = setInterval(
					() =>
					{
						var pantheon = Game.Objects['Temple'].minigame;
						if (pantheon.slot[0] == -1)
						{
							pantheon.dragGod(pantheon.godsById[CookieAssistant.config.particular.spirits.slot1]);
							pantheon.hoverSlot(0);
							pantheon.dropGod();
							pantheon.hoverSlot(-1);
						}
						if (pantheon.slot[1] == -1)
						{
							pantheon.dragGod(pantheon.godsById[CookieAssistant.config.particular.spirits.slot2]);
							pantheon.hoverSlot(1);
							pantheon.dropGod();
							pantheon.hoverSlot(-1);
						}
						if (pantheon.slot[2] == -1)
						{
							pantheon.dragGod(pantheon.godsById[CookieAssistant.config.particular.spirits.slot3]);
							pantheon.hoverSlot(2);
							pantheon.dropGod();
							pantheon.hoverSlot(-1);
						}
					},
					CookieAssistant.config.intervals.autoSetSpirits
				);
			},
		}
		
		Game.Notify('CookieAssistant loaded!', '', '', 1, 1);
		CookieAssistant.CheckUpdate();
	}

	CookieAssistant.restoreDefaultConfig = function(mode){
		CookieAssistant.config = CookieAssistant.defaultConfig();
		if(mode == 2)
		{
			CookieAssistant.save(CookieAssistant.config);
		}
	}

	CookieAssistant.SwitchNextSeason = function()
	{
		var seasons = ["valentines", "christmas", "easter", "halloween"];
		var isCompletes = [
			(Game.GetHowManyHeartDrops() / Game.heartDrops.length) >= 1,
			((Game.GetHowManySantaDrops() / Game.santaDrops.length) >= 1) && ((Game.GetHowManyReindeerDrops() / Game.reindeerDrops.length) >= 1) && Game.santaLevel >= 14,
			(Game.GetHowManyEggs() / Game.easterEggs.length) >= 1,
			(Game.GetHowManyHalloweenDrops() / Game.halloweenDrops.length) >= 1,
		];
		
		var targetSeason = "";
		// console.log("シーズン獲得状況 : ");
		// console.log(isCompletes);
		
		for (var i in seasons)
		{
			if (!isCompletes[i])
			{
				targetSeason = seasons[i];
				break;
			}
		}
		//全シーズンのアップグレードが完了していて現在どこかのシーズンになっている時、現在のシーズンを解除する
		if (Game.season != "" && targetSeason == "")
		{
			targetSeason = Game.season;
		}
		if (targetSeason != "")
		{
			// console.log("ChangeSeason : " + targetSeason);
			if (targetSeason == Game.season)
			{
				//値の直接書き換えになってしまうが、内部のシーズンキャンセルの挙動もこれなので許してくれ
				Game.seasonT = -1;
			}
			else if (Game.UpgradesInStore.indexOf(Game.Upgrades[Game.seasons[targetSeason].trigger]) != -1)
			{
				Game.Upgrades[Game.seasons[targetSeason].trigger].buy(1);
			}
		}
	}

	//コンフィグのチェック
	//アプデ時に新規項目がundefinedになって1ms周期の実行になってしまうのを防止
	CookieAssistant.CheckConfig = function()
	{		
		var defaultConfig = CookieAssistant.defaultConfig();
		for (const [key, value] of Object.entries(defaultConfig.flags))
		{
			if (CookieAssistant.config.flags[key] == undefined)
			{
				CookieAssistant.config.flags[key] = value;
			}
		}
		for (const [key, value] of Object.entries(defaultConfig.intervals))
		{
			if (CookieAssistant.config.intervals[key] == undefined)
			{
				CookieAssistant.config.intervals[key] = value;
			}
		}
		if (CookieAssistant.config.particular == undefined)
		{
			CookieAssistant.config.particular = defaultConfig.particular;
		}
		
		for (const [key, value] of Object.entries(defaultConfig.particular))
		{
			if (CookieAssistant.config.particular[key] == undefined)
			{
				CookieAssistant.config.particular[key] = value;
			}
		}
	}


	//オプション&統計の追加
	CookieAssistant.ReplaceGameMenu = function()
	{
		Game.customOptionsMenu.push(function()
		{
			CCSE.AppendCollapsibleOptionsMenu(CookieAssistant.name, CookieAssistant.getMenuString());
		});
		
		Game.customStatsMenu.push(function()
		{
			CCSE.AppendStatsVersionNumber(CookieAssistant.name, CookieAssistant.version);
		});
	}
	
	CookieAssistant.getMenuString = function()
	{
		let m = CCSE.MenuHelper;
		str = m.Header('Basic Assists');
		//大クッキークリック
		str +=  '<div class="listing">'
				+ m.ToggleButton(CookieAssistant.config.flags, 'autoClickBigCookie', 'CookieAssistant_autoClickBigCookieButton', 'AutoClick BigCookie ON', 'AutoClick BigCookie OFF', "CookieAssistant.Toggle")
				+ '<label>Interval(ms) : </label>'
				+ m.InputBox("CookieAssistant_Interval_autoClickBigCookie", 40, CookieAssistant.config.intervals.autoClickBigCookie, "CookieAssistant.ChangeInterval('autoClickBigCookie', this.value)")
				+ '</div>';
		//黄金クッキークリック
		str +=  '<div class="listing">' + m.ToggleButton(CookieAssistant.config.flags, 'autoClickGoldenCookie', 'CookieAssistant_autoClickGoldenCookieButton', 'AutoClick ' + loc("Golden cookie") + ' ON', 'AutoClick ' + loc("Golden cookie") + ' OFF', "CookieAssistant.Toggle")
				+ '<label>Interval(ms) : </label>'
				+ m.InputBox("CookieAssistant_Interval_autoClickBigCookie", 40, CookieAssistant.config.intervals.autoClickBigCookie, "CookieAssistant.ChangeInterval('autoClickBigCookie', this.value)")
				+ '</div>';
		//トナカクリック
		str +=  '<div class="listing">' + m.ToggleButton(CookieAssistant.config.flags, 'autoClickReindeer', 'CookieAssistant_autoClickReindeerButton', 'AutoClick ' + loc("Reindeer") + ' ON', 'AutoClick ' + loc("Reindeer") + ' OFF', "CookieAssistant.Toggle")
				+ '<label>Interval(ms) : </label>'
				+ m.InputBox("CookieAssistant_Interval_autoClickReindeer", 40, CookieAssistant.config.intervals.autoClickReindeer, "CookieAssistant.ChangeInterval('autoClickReindeer', this.value)")
				+ '</div>';
		//FortuneNewsクリック
		str +=  '<div class="listing">' + m.ToggleButton(CookieAssistant.config.flags, 'autoClickFortuneNews', 'CookieAssistant_autoClickFortuneNewsButton', 'AutoClick FortuneNews ON', 'AutoClick FortuneNews OFF', "CookieAssistant.Toggle")
				+ '<label>Interval(ms) : </label>'
				+ m.InputBox("CookieAssistant_Interval_autoClickFortuneNews", 40, CookieAssistant.config.intervals.autoClickFortuneNews, "CookieAssistant.ChangeInterval('autoClickFortuneNews', this.value)")
				+ '</div>';
		//虫撃破
		str +=  '<div class="listing">' + m.ToggleButton(CookieAssistant.config.flags, 'autoClickWrinklers', 'CookieAssistant_autoClickWrinklers', 'AutoClick ' + loc("wrinkler") + ' ON', 'AutoClick ' + loc("wrinkler") + ' OFF', "CookieAssistant.Toggle")
				+ '<label>Interval(ms) : </label>'
				+ m.InputBox("CookieAssistant_Interval_autoClickWrinklers", 40, CookieAssistant.config.intervals.autoClickWrinklers, "CookieAssistant.ChangeInterval('autoClickWrinklers', this.value)")
				+ '</div>';
		//ElderPedge自動購入
		str +=  '<div class="listing">' + m.ToggleButton(CookieAssistant.config.flags, 'autoBuyElderPledge', 'CookieAssistant_autoBuyElderPledge', 'AutoBuy ' + loc("[Upgrade name 74]Elder Pledge") + ' ON', 'AutoBuy ' + loc("[Upgrade name 74]Elder Pledge") + ' OFF', "CookieAssistant.Toggle")
				+ '<label>Interval(ms) : </label>'
				+ m.InputBox("CookieAssistant_Interval_autoBuyElderPledge", 40, CookieAssistant.config.intervals.autoBuyElderPledge, "CookieAssistant.ChangeInterval('autoBuyElderPledge', this.value)")
				+ '<div class="listing">'
					+ '<label>※この機能はアップグレードの生贄用めん棒も自動で購入するようになります。</label><br />'
					+ '<label>This feature will also automatically purchase "Sacrificial rolling pins".</label><br />'
				+ '</div>'
				+ '</div>';
		//アップグレード自動購入
		str +=  '<div class="listing">' + m.ToggleButton(CookieAssistant.config.flags, 'autoBuyUpgrades', 'CookieAssistant_autoBuyUpgrades', 'AutoBuy ' + loc("upgrade") + ' ON', 'AutoBuy ' + loc("upgrade") + ' OFF', "CookieAssistant.Toggle")
				+ '<label>Interval(ms) : </label>'
				+ m.InputBox("CookieAssistant_Interval_autoBuyUpgrades", 40, CookieAssistant.config.intervals.autoBuyUpgrades, "CookieAssistant.ChangeInterval('autoBuyUpgrades', this.value)")
				+ '<div class="listing">'
					+ '<label>MODE : </label>'
					+ '<a class="option" ' + Game.clickStr + '=" CookieAssistant.config.particular.upgrades.mode++; if(CookieAssistant.config.particular.upgrades.mode >= Object.keys(CookieAssistant.modes.upgrades).length){CookieAssistant.config.particular.upgrades.mode = 0;} Game.UpdateMenu(); PlaySound(\'snd/tick.mp3\');">'
							+ CookieAssistant.modes.upgrades[CookieAssistant.config.particular.upgrades.mode].desc
					+ '</a><br />'
				+ '</div>'
				+ '</div>';
		//建物自動購入
		str +=  '<div class="listing">' + m.ToggleButton(CookieAssistant.config.flags, 'autoBuyBuildings', 'CookieAssistant_autoBuyBuildings', 'AutoBuy ' + loc("building") + ' ON', 'AutoBuy ' + loc("building") + ' OFF', "CookieAssistant.Toggle")
				+ '<label>Interval(ms) : </label>'
				+ m.InputBox("CookieAssistant_Interval_autoBuyBuildings", 40, CookieAssistant.config.intervals.autoBuyBuildings, "CookieAssistant.ChangeInterval('autoBuyBuildings', this.value)")
				+ '<div class="listing">'
					+ '<label>MODE : </label>'
					+ '<a class="option" ' + Game.clickStr + '=" CookieAssistant.config.particular.buildings.mode++; if(CookieAssistant.config.particular.buildings.mode >= Object.keys(CookieAssistant.modes.buildings).length){CookieAssistant.config.particular.buildings.mode = 0;} Game.UpdateMenu(); PlaySound(\'snd/tick.mp3\');">'
							+ CookieAssistant.modes.buildings[CookieAssistant.config.particular.buildings.mode].desc
					+ '</a><br />'
				+ '</div>'
				+ '</div>';
		
		str += "<br>"
		str += m.Header('Advanced Assists');

		//自動詠唱
		str +=  '<div class="listing">' + m.ToggleButton(CookieAssistant.config.flags, 'autoSpellonBuff', 'CookieAssistant_autoSpellonBuff', 'AutoSpellCast "' + loc("Force the Hand of Fate") + '" ON', 'AutoSpellCast "' + loc("Force the Hand of Fate") + '" OFF', "CookieAssistant.Toggle")
				+ '<label>Interval(ms) : </label>'
				+ m.InputBox("CookieAssistant_Interval_autoSpellonBuff", 40, CookieAssistant.config.intervals.autoSpellonBuff, "CookieAssistant.ChangeInterval('autoSpellonBuff', this.value)")
				+ '<div class="listing">'
					+ '<label>MODE : </label>'
					+ '<a class="option" ' + Game.clickStr + '=" CookieAssistant.config.particular.spell.mode++; if(CookieAssistant.config.particular.spell.mode >= Object.keys(CookieAssistant.modes.spell).length){CookieAssistant.config.particular.spell.mode = 0;} Game.UpdateMenu(); PlaySound(\'snd/tick.mp3\');">'
							+ CookieAssistant.modes.spell[CookieAssistant.config.particular.spell.mode].desc
					+ '</a><br />'
					+ '<label>フィーバー効果(CPS7倍)中に呪文「運命を押し付ける」を自動で発動する</label><br />'
					+ '<label>Automatically activate the spell "Hand of Fate" during the frenzy effect (7x CPS).</label><br />'
				+ '</div>'
				+ '</div>';
		
		//シーズン自動切換え
		str +=  '<div class="listing">' + m.ToggleButton(CookieAssistant.config.flags, 'autoSwitchSeason', 'CookieAssistant_autoSwitchSeason', 'AutoSwitch Seasons ON', 'AutoSwitch Seasons OFF', "CookieAssistant.Toggle")
				+ '<label>Interval(ms) : </label>'
				+ m.InputBox("CookieAssistant_Interval_autoSwitchSeason", 40, CookieAssistant.config.intervals.autoSwitchSeason, "CookieAssistant.ChangeInterval('autoSwitchSeason', this.value)")
				+ '<div class="listing">'
					+ '<label>アップグレードが残っているシーズンに自動的に切り替えます。</label><br />'
					+ '<label>Automatically switch to seasons in which the upgrade is still remained. </label><br />'
				+ '</div>'
				+ '</div>';

		//ドラゴン自動育成
		str +=  '<div class="listing">' + m.ToggleButton(CookieAssistant.config.flags, 'autoTrainDragon', 'CookieAssistant_autoTrainDragon', 'AutoTrain Dragon ON', 'AutoTrain Dragon OFF', "CookieAssistant.Toggle")
				+ '<label>Interval(ms) : </label>'
				+ m.InputBox("CookieAssistant_Interval_autoTrainDragon", 40, CookieAssistant.config.intervals.autoTrainDragon, "CookieAssistant.ChangeInterval('autoTrainDragon', this.value)")
				+ '<div class="listing">'
					+ '<label>Aura1 : </label>'
						+ '<a class="option" ' + Game.clickStr + '=" CookieAssistant.config.particular.dragon.aura1++; if(CookieAssistant.config.particular.dragon.aura1 >= Object.keys(Game.dragonAuras).length){CookieAssistant.config.particular.dragon.aura1 = 0;} Game.UpdateMenu(); PlaySound(\'snd/tick.mp3\');">'
							+ Game.dragonAuras[CookieAssistant.config.particular.dragon.aura1].dname
						+ '</a>'
					+ '<label>      Aura2 : </label>'
						+ '<a class="option" ' + Game.clickStr + '=" CookieAssistant.config.particular.dragon.aura2++; if(CookieAssistant.config.particular.dragon.aura2 >= Object.keys(Game.dragonAuras).length){CookieAssistant.config.particular.dragon.aura2 = 0;} Game.UpdateMenu(); PlaySound(\'snd/tick.mp3\');">'
							+ Game.dragonAuras[CookieAssistant.config.particular.dragon.aura2].dname
						+ '</a><br />'
				+ '</div>'
				+ '</div>';

		//パンテオンのスロット自動セット
		str +=  '<div class="listing">' + m.ToggleButton(CookieAssistant.config.flags, 'autoSetSpirits', 'CookieAssistant_autoSetSpirits', 'AutoSet Spirits ON', 'AutoSet Spirits OFF', "CookieAssistant.Toggle")
				+ '<label>Interval(ms) : </label>'
				+ m.InputBox("CookieAssistant_Interval_autoSetSpirits", 40, CookieAssistant.config.intervals.autoSetSpirits, "CookieAssistant.ChangeInterval('autoSetSpirits', this.value)")
				+ '<div class="listing">'
					+ '<label>Diamond : </label>'
					+ `<a class="option" ` + Game.clickStr + `=" CookieAssistant.config.particular.spirits.slot1++; if(CookieAssistant.config.particular.spirits.slot1 >= Object.keys(Game.Objects['Temple'].minigame.gods).length){CookieAssistant.config.particular.spirits.slot1 = 0;} Game.UpdateMenu();">`
						+ Game.Objects['Temple'].minigame.godsById[CookieAssistant.config.particular.spirits.slot1].name
					+ '</a>'
					+ '<label>Ruby : </label>'
					+ `<a class="option" ` + Game.clickStr + `=" CookieAssistant.config.particular.spirits.slot2++; if(CookieAssistant.config.particular.spirits.slot2 >= Object.keys(Game.Objects['Temple'].minigame.gods).length){CookieAssistant.config.particular.spirits.slot2 = 0;} Game.UpdateMenu();">`
						+ Game.Objects['Temple'].minigame.godsById[CookieAssistant.config.particular.spirits.slot2].name
					+ '</a>'
					+ '<label>Jade : </label>'
					+ `<a class="option" ` + Game.clickStr + `=" CookieAssistant.config.particular.spirits.slot3++; if(CookieAssistant.config.particular.spirits.slot3 >= Object.keys(Game.Objects['Temple'].minigame.gods).length){CookieAssistant.config.particular.spirits.slot3 = 0;} Game.UpdateMenu();">`
						+ Game.Objects['Temple'].minigame.godsById[CookieAssistant.config.particular.spirits.slot3].name
					+ '</a>'
					+ '</div>'
				+ '</div>';

		str += "<br>"
		str += m.Header('Misc');
		str += '<div class="listing">'
				+ m.ActionButton("CookieAssistant.restoreDefaultConfig(2); CookieAssistant.DoAction(); Game.UpdateMenu();", 'Restore Default')
				+ m.ActionButton("CookieAssistant.CheckUpdate();", 'Check Update')
				+ m.ActionButton("Steam.openLink('https://steamcommunity.com/sharedfiles/filedetails/?id=2596469882');", 'Get more information')
			+ '</div>';

		return str;
	}
	
	CookieAssistant.Toggle = function(prefName, button, on, off, invert)
	{
		if(CookieAssistant.config.flags[prefName])
		{
			l(button).innerHTML = off;
			CookieAssistant.config.flags[prefName] = 0;
		}
		else
		{
			l(button).innerHTML = on;
			CookieAssistant.config.flags[prefName] = 1;
		}
		l(button).className = 'option' + ((CookieAssistant.config.flags[prefName] ^ invert) ? '' : ' off');
		CookieAssistant.DoAction();
	}

	CookieAssistant.ChangeInterval = function(prefName, value)
	{
		CookieAssistant.config.intervals[prefName] = value;
		CookieAssistant.DoAction();
	}

	CookieAssistant.DoAction = function()
	{
		for (const [key, isClick] of Object.entries(CookieAssistant.config.flags))
		{
			if (isClick)
			{
				if (CookieAssistant.intervalHandles[key] == null)
				{
					CookieAssistant.actions[key]();
				}
				else
				{
					clearInterval(CookieAssistant.intervalHandles[key]);
					CookieAssistant.intervalHandles[key] = null;
					CookieAssistant.actions[key]();
				}
			}
			else if (CookieAssistant.intervalHandles[key] != null)
			{
				clearInterval(CookieAssistant.intervalHandles[key]);
				CookieAssistant.intervalHandles[key] = null;
			}
		}
	}
	
	CookieAssistant.save = function()
	{
		return JSON.stringify(CookieAssistant.config);
	}

	CookieAssistant.load = function(str)
	{
		CookieAssistant.config = JSON.parse(str);
		CookieAssistant.CheckConfig();
		CookieAssistant.DoAction();
	}
	
	CookieAssistant.CheckUpdate = async function()
	{
		var res = await fetch("https://api.github.com/repos/hitsub/CookieAssistant/releases/latest")
		var json = await res.json()

		if(json.tag_name == CookieAssistant.version)
		{
			Game.Notify(CookieAssistant.name, '最新版です<br>This is the latest version', "", 3)
			return;
		}

		Game.Notify(CookieAssistant.name, `<b style="color: #ff8000">アップデートがあります<br>There will be an update.</b><br><a ${Game.clickStr}="Steam.openLink('${json.assets[0].browser_download_url}')" target="_brank">ここからダウンロードしてください。<br>Download Here</a>`)
		Game.UpdateMenu();
	}

	if(CCSE.ConfirmGameVersion(CookieAssistant.name, CookieAssistant.version, CookieAssistant.GameVersion))
	{
		Game.registerMod(CookieAssistant.name, CookieAssistant);
	}
}

if(!CookieAssistant.isLoaded)
{
	if(CCSE && CCSE.isLoaded)
	{
		CookieAssistant.launch();
	}
	else
	{
		if(!CCSE) var CCSE = {};
		if(!CCSE.postLoadHooks) CCSE.postLoadHooks = [];
		CCSE.postLoadHooks.push(CookieAssistant.launch);
	}
}