if(CookieAssistant === undefined)
{
    var CookieAssistant = {};
}
if(typeof CCSE == 'undefined')
{
    Game.LoadMod('https://raw.githubusercontent.com/klattmose/klattmose.github.io/master/CookieClicker/SteamMods/CCSE/main.js');
}

CookieAssistant.name = 'Cookie Assistant';
CookieAssistant.version = '0.1.0';
CookieAssistant.GameVersion = '2.04';


CookieAssistant.launch = function()
{
	CookieAssistant.defaultConfig = function()
    {
		var conf = 
        {
			flags:
			{
				autoClickBigCookie: 0,
				autoClickGoldenCookie: 0,
				autoClickReindeer: 0,
				autoClickFortuneNews: 0,
			},
			intervals:
			{
				autoClickBigCookie: 1,
				autoClickGoldenCookie: 1,
				autoClickReindeer: 100,
				autoClickFortuneNews: 100,
			},
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
			autoReindeer: null,
			autoFortuneNews: null,
		}

		CookieAssistant.actions =
		{
			autoClickBigCookie: () =>
			{
				CookieAssistant.intervalHandles["autoClickBigCookie"] = setInterval(
					() => { bigCookie.click(); Game.lastClick=0; },
					CookieAssistant.config.intervals["autoClickBigCookie"]
				)
			},
			autoClickGoldenCookie: () =>
			{
				CookieAssistant.intervalHandles["autoClickGoldenCookie"] = setInterval(
					() => { for (var h in Game.shimmers){if(Game.shimmers[h].type=="golden"){Game.shimmers[h].pop();}} },
					CookieAssistant.config.intervals["autoClickGoldenCookie"]
				)
			},
			autoClickReindeer: () =>
			{
				CookieAssistant.intervalHandles["autoClickReindeer"] = setInterval(
					() => { for (var h in Game.shimmers){if(Game.shimmers[h].type=="reindeer"){Game.shimmers[h].pop();}} },
					CookieAssistant.config.intervals["autoClickReindeer"]
				)
			},
			autoClickFortuneNews: () =>
			{
				CookieAssistant.intervalHandles["autoClickFortuneNews"] = setInterval(
					() => { if (Game.TickerEffect && Game.TickerEffect.type == 'fortune') { Game.tickerL.click(); }},
					CookieAssistant.config.intervals["autoClickFortuneNews"]
				)
			},
		}
		
		Game.Notify('CookieAssistant loaded!', '', '', 1, 1);
	}

	CookieAssistant.restoreDefaultConfig = function(mode){
		CookieAssistant.config = CookieAssistant.defaultConfig();
		if(mode == 2)
        {
            CookieAssistant.save(CookieAssistant.config);
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
        str = m.Header('Assists');
		//大クッキークリック
        str +=  '<div class="listing">'
                + m.ToggleButton(CookieAssistant.config.flags, 'autoClickBigCookie', 'CookieAssistant_autoClickBigCookieButton', 'AutoClick BigCookie ON', 'AutoClick BigCookie OFF', "CookieAssistant.Toggle")
                + '<label>Interval(ms) : </label>'
				+ m.InputBox("CookieAssistant_Interval_autoClickBigCookie", 40, CookieAssistant.config.intervals["autoClickBigCookie"], "CookieAssistant.ChangeInterval('autoClickBigCookie', this.value)")
                + '</div>';
		//黄金クッキークリック
        str +=  '<div class="listing">' + m.ToggleButton(CookieAssistant.config.flags, 'autoClickGoldenCookie', 'CookieAssistant_autoClickGoldenCookieButton', 'AutoClick GoldenCookie ON', 'AutoClick GoldenCookie OFF', "CookieAssistant.Toggle")
				+ '<label>Interval(ms) : </label>'
				+ m.InputBox("CookieAssistant_Interval_autoClickBigCookie", 40, CookieAssistant.config.intervals["autoClickBigCookie"], "CookieAssistant.ChangeInterval('autoClickBigCookie', this.value)")
				+ '</div>';
		//トナカクリック
		str +=  '<div class="listing">' + m.ToggleButton(CookieAssistant.config.flags, 'autoClickReindeer', 'CookieAssistant_autoClickReindeerButton', 'AutoClick Reindeer(トナカイ) ON', 'AutoClick Reindeer(トナカイ) OFF', "CookieAssistant.Toggle")
				+ '<label>Interval(ms) : </label>'
				+ m.InputBox("CookieAssistant_Interval_autoClickReindeer", 40, CookieAssistant.config.intervals["autoClickReindeer"], "CookieAssistant.ChangeInterval('autoClickReindeer', this.value)")
				+ '<div class="listing">'
					+ '<label>※クリスマスイベント中以外は有効にしても効果はありません</label><br />'
					+ '<label>※Will not take effect except during Christmas events.</label><br />'
				+ '</div>'
				+ '</div>';
		//FortuneNewsクリック
		str +=  '<div class="listing">' + m.ToggleButton(CookieAssistant.config.flags, 'autoClickFortuneNews', 'CookieAssistant_autoClickFortuneNewsButton', 'AutoClick FortuneNews ON', 'AutoClick FortuneNews OFF', "CookieAssistant.Toggle")
				+ '<label>Interval(ms) : </label>'
				+ m.InputBox("CookieAssistant_Interval_autoClickFortuneNews", 40, CookieAssistant.config.intervals["autoClickFortuneNews"], "CookieAssistant.ChangeInterval('autoClickFortuneNews', this.value)")
				+ '<div class="listing">'
					+ '<label>※フォーチュンクッキーのアップグレードを購入するまで有効にしても効果はありません</label><br />'
					+ '<label>※Will not take effect until you purchase the fortune cookie upgrade.</label><br />'
				+ '</div>'
				+ '</div>';

        str += m.Header('Misc');
        str += '<div class="listing">' + m.ActionButton("CookieAssistant.restoreDefaultConfig(2); CookieAssistant.DoAction(); Game.UpdateMenu();", 'Restore Default') + '</div>';

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
		CookieAssistant.DoAction();
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