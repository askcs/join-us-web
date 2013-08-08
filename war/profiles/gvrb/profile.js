/**
 * Installation profile
 */
var profile = {

  meta: 'gvrb',

  title: 'REDDINGSBRIGADE',

	host: function ()
	{
    return ($.browser.msie) ? '/proxy/ns_gvrb' : 'http://3rc2.ask-services.appspot.com/ns_gvrb';
	},

  states: [
    'com.ask-cs.State.Available',
    'com.ask-cs.State.Unavailable',
    'com.ask-cs.State.Unreached'
  ],

  timeline: {
    config: {
      layouts: {
        groups:   true,
        members:  false
      }
    }
  },

  divisions: [],

  roles: [
    {
      id: 1,
      label: 'Planner'
    }, 
    {
      id: 2,
      label: 'Schipper'
    }, 
    {
      id: 3,
      label: 'Opstapper'
    }
  ],

  p2000: {
    status: true,
    url:    'http://knrmtest.myask.me/rpc/client/p2000.php',
    codes:  '1500982'
  },

  mobileApp: {
    status:   true
  },

  analytics: {
    status: true,
    code:   function ()
    {
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-41638717-1', 'ask-cs.com');
      ga('send', 'pageview');
    }
  }
};






















/**
 * Demo users for testing
 */
var demo_users = [
    {
        "config": {},
        "name": "Dennis van Mil",
        "personalAgentUrl": "http://3rc2.ask-services.appspot.com/eveagents/personalagent/dennisvanmil/",
        "rate": 1,
        "resources": {
            "id": "dennisvanmil",
            "settingsWebPaige": "{\"user\":{\"language\":\"nl\",\"google\":\"\"}}",
            "askPass": "59d0574087c3436713ba0f47aadc3b9f",
            "name": "Dennis van Mil",
            "EmailAddress": "d.vanmil@reddingsbrigade.com",
            "PhoneAddress": "+31615345742",
            "role": "3"
        },
        "state": "com.ask-cs.no planning",
        "uuid": "dennisvanmil"
    },
    {
        "config": {},
        "name": "Erik Noordam",
        "personalAgentUrl": "http://3rc2.ask-services.appspot.com/eveagents/personalagent/eriknoordam/",
        "rate": 1,
        "resources": {
            "id": "eriknoordam",
            "settingsWebPaige": "{\"user\":{\"language\":\"nl\",\"google\":\"\"}}",
            "askPass": "9492bf5e3927106198b244e71e1c17e8",
            "name": "Erik Noordam",
            "EmailAddress": "erik-noordam@hotmail.com",
            "PhoneAddress": "+31642833442",
            "role": "3"
        },
        "state": "com.ask-cs.no planning",
        "uuid": "eriknoordam"
    },
    {
        "config": {},
        "name": "Bill Zegers",
        "personalAgentUrl": "http://3rc2.ask-services.appspot.com/eveagents/personalagent/billzegers/",
        "rate": 1,
        "resources": {
            "id": "billzegers",
            "settingsWebPaige": "{\"user\":{\"language\":\"nl\",\"google\":\"\"}}",
            "askPass": "11ccd9d29ae6851d15787716949f94fb",
            "name": "Bill Zegers",
            "EmailAddress": "bill.zegers@gmail.com",
            "PhoneAddress": "+31642380405",
            "role": "3"
        },
        "state": "com.ask-cs.no planning",
        "uuid": "billzegers"
    },
    {
        "config": {},
        "name": "Erik Willems",
        "personalAgentUrl": "http://3rc2.ask-services.appspot.com/eveagents/personalagent/erikwillems/",
        "rate": 1,
        "resources": {
            "id": "erikwillems",
            "settingsWebPaige": "{\"user\":{\"language\":\"nl\",\"google\":\"\"}}",
            "askPass": "ba319e41b85ed376694764d1a89a294c",
            "name": "Erik Willems",
            "EmailAddress": "e.willems@reddingsbrigade.com",
            "PhoneAddress": "+31651421529",
            "role": "3"
        },
        "state": "com.ask-cs.no planning",
        "uuid": "erikwillems"
    },
    {
        "config": {},
        "name": "Pieter Jan Vreugdenhil",
        "personalAgentUrl": "http://3rc2.ask-services.appspot.com/eveagents/personalagent/pieterjanvreugdenhil/",
        "rate": 1,
        "resources": {
            "id": "pieterjanvreugdenhil",
            "settingsWebPaige": "{\"user\":{\"language\":\"nl\",\"google\":\"\"}}",
            "askPass": "8b571a843df243eaa184148256d5fe32",
            "name": "Pieter Jan Vreugdenhil",
            "EmailAddress": "pjvreugdenhil@kabelfoon.nl",
            "PhoneAddress": "+31653845132",
            "role": "3"
        },
        "state": "com.ask-cs.no planning",
        "uuid": "pieterjanvreugdenhil"
    },
    {
        "config": {},
        "name": "Robert van Vliet",
        "personalAgentUrl": "http://3rc2.ask-services.appspot.com/eveagents/personalagent/robertvanvliet/",
        "rate": 1,
        "resources": {
            "id": "robertvanvliet",
            "settingsWebPaige": "{\"user\":{\"language\":\"nl\",\"google\":\"\"}}",
            "askPass": "f45488014bb5b547fe85b2713d1fc1ba",
            "name": "Robert van Vliet",
            "EmailAddress": "robertvanvliet78@gmail.com",
            "PhoneAddress": "+31628466910",
            "role": "3"
        },
        "state": "com.ask-cs.no planning",
        "uuid": "robertvanvliet"
    },
    {
        "config": {},
        "name": "Wim Verhagen",
        "personalAgentUrl": "http://3rc2.ask-services.appspot.com/eveagents/personalagent/wimverhagen/",
        "rate": 1,
        "resources": {
            "id": "wimverhagen",
            "settingsWebPaige": "{\"user\":{\"language\":\"nl\",\"google\":\"\"}}",
            "askPass": "953b04141c9a5af7c499788bfcad1603",
            "name": "Wim Verhagen",
            "EmailAddress": "cwverhagen@gmail.com",
            "PhoneAddress": "+31655738922",
            "role": "3"
        },
        "state": "com.ask-cs.no planning",
        "uuid": "wimverhagen"
    },
    {
        "config": {},
        "name": "Ruben Verduijn",
        "personalAgentUrl": "http://3rc2.ask-services.appspot.com/eveagents/personalagent/rubenverduijn/",
        "rate": 1,
        "resources": {
            "id": "rubenverduijn",
            "settingsWebPaige": "{\"user\":{\"language\":\"nl\",\"google\":\"\"}}",
            "askPass": "462a0b306add4cac477db1c059ab4eae",
            "name": "Ruben Verduijn",
            "EmailAddress": "zweefzadel@hotmail.com",
            "PhoneAddress": "+31624805239",
            "role": "3"
        },
        "state": "com.ask-cs.no planning",
        "uuid": "rubenverduijn"
    },
    {
        "config": {},
        "name": "Cynthia Verduijn",
        "personalAgentUrl": "http://3rc2.ask-services.appspot.com/eveagents/personalagent/cynthiaverduijn/",
        "rate": 1,
        "resources": {
            "id": "cynthiaverduijn",
            "settingsWebPaige": "{\"user\":{\"language\":\"nl\",\"google\":\"\"}}",
            "askPass": "b9e214f13ea41c50bf2ecadc148f8348",
            "name": "Cynthia Verduijn",
            "EmailAddress": "cynthiapersoon@hotmail.com",
            "PhoneAddress": "+31624491071",
            "role": "3"
        },
        "state": "com.ask-cs.no planning",
        "uuid": "cynthiaverduijn"
    },
    {
        "config": {},
        "name": "Rene Veenman",
        "personalAgentUrl": "http://3rc2.ask-services.appspot.com/eveagents/personalagent/reneveenman/",
        "rate": 1,
        "resources": {
            "id": "reneveenman",
            "settingsWebPaige": "{\"user\":{\"language\":\"nl\",\"google\":\"\"}}",
            "askPass": "6157fe37549e0c4a57f1899754ea245a",
            "name": "Rene Veenman",
            "EmailAddress": "renemadeleine@caiway.nl",
            "PhoneAddress": "+31610268367",
            "role": "3"
        },
        "state": "com.ask-cs.no planning",
        "uuid": "reneveenman"
    },
    {
        "config": {},
        "name": "Stephan Stokhof",
        "personalAgentUrl": "http://3rc2.ask-services.appspot.com/eveagents/personalagent/stephanstokhof/",
        "rate": 1,
        "resources": {
            "id": "stephanstokhof",
            "settingsWebPaige": "{\"user\":{\"language\":\"nl\",\"google\":\"\"}}",
            "askPass": "3111cef6a299b4eeea71f5fb657098c7",
            "name": "Stephan Stokhof",
            "EmailAddress": "info@stokhof.eu",
            "PhoneAddress": "+31633919283",
            "role": "3"
        },
        "state": "com.ask-cs.no planning",
        "uuid": "stephanstokhof"
    },
    {
        "config": {},
        "name": "Robbin Schuurman",
        "personalAgentUrl": "http://3rc2.ask-services.appspot.com/eveagents/personalagent/robbinschuurman/",
        "rate": 1,
        "resources": {
            "id": "robbinschuurman",
            "settingsWebPaige": "{\"user\":{\"language\":\"nl\",\"google\":\"\"}}",
            "askPass": "d0debf75b0afd62988891b0ad96a5899",
            "name": "Robbin Schuurman",
            "EmailAddress": "robbin@burozeven.nl",
            "PhoneAddress": "+31651431181",
            "role": "3"
        },
        "state": "com.ask-cs.no planning",
        "uuid": "robbinschuurman"
    },
    {
        "config": {},
        "name": "Stefan Scholtes",
        "personalAgentUrl": "http://3rc2.ask-services.appspot.com/eveagents/personalagent/stefanscholtes/",
        "rate": 1,
        "resources": {
            "id": "stefanscholtes",
            "settingsWebPaige": "{\"user\":{\"language\":\"nl\",\"google\":\"\"}}",
            "askPass": "9e900436880197a7c387058015363598",
            "name": "Stefan Scholtes",
            "EmailAddress": "s.scholtes@reddingsbrigade.com",
            "PhoneAddress": "+31643000498",
            "role": "3"
        },
        "state": "com.ask-cs.no planning",
        "uuid": "stefanscholtes"
    },
    {
        "config": {},
        "name": "Lars Pepermans",
        "personalAgentUrl": "http://3rc2.ask-services.appspot.com/eveagents/personalagent/larspepermans/",
        "rate": 1,
        "resources": {
            "id": "larspepermans",
            "settingsWebPaige": "{\"user\":{\"language\":\"nl\",\"google\":\"\"}}",
            "askPass": "4e9087d1d8d982c7c429b3c69327ce96",
            "name": "Lars Pepermans",
            "EmailAddress": "peper5277@hotmail.com",
            "PhoneAddress": "+31683595177",
            "role": "3"
        },
        "state": "com.ask-cs.no planning",
        "uuid": "larspepermans"
    },
    {
        "config": {},
        "name": "Tom Ouwerling",
        "personalAgentUrl": "http://3rc2.ask-services.appspot.com/eveagents/personalagent/tomouwerling/",
        "rate": 1,
        "resources": {
            "id": "tomouwerling",
            "settingsWebPaige": "{\"user\":{\"language\":\"nl\"},\"app\":{\"widgets\":{\"groups\":{\"c6943a70-edae-1030-bc04-005056bc000c\":true}},\"group\":\"c6943a70-edae-1030-bc04-005056bc000c\"}}",
            "askPass": "4759519b4bbbdd16a696f1d1c1f35971",
            "name": "Tom Ouwerling",
            "EmailAddress": "t.ouwerling@reddingsbrigade.com",
            "PhoneAddress": "+31622380900",
            "role": "1"
        },
        "state": "com.ask-cs.no planning",
        "uuid": "tomouwerling"
    },
    {
        "config": {},
        "name": "Peter Ouwendijk",
        "personalAgentUrl": "http://3rc2.ask-services.appspot.com/eveagents/personalagent/peterouwendijk/",
        "rate": 1,
        "resources": {
            "id": "peterouwendijk",
            "settingsWebPaige": "{\"user\":{\"language\":\"nl\",\"google\":\"\"}}",
            "askPass": "cc6f82fd7a91bab77668a06d374f534b",
            "name": "Peter Ouwendijk",
            "EmailAddress": "peter@ellmax.nl",
            "PhoneAddress": "+31620602882",
            "role": "3"
        },
        "state": "com.ask-cs.no planning",
        "uuid": "peterouwendijk"
    },
    {
        "config": {},
        "name": "Niels Lijzenga",
        "personalAgentUrl": "http://3rc2.ask-services.appspot.com/eveagents/personalagent/nielslijzenga/",
        "rate": 1,
        "resources": {
            "id": "nielslijzenga",
            "settingsWebPaige": "{\"user\":{\"language\":\"nl\",\"google\":\"\"}}",
            "askPass": "0caf065ccd370d79267702267e185084",
            "name": "Niels Lijzenga",
            "EmailAddress": "niels@lijzenga.biz",
            "PhoneAddress": "+31620624804",
            "role": "3"
        },
        "state": "com.ask-cs.no planning",
        "uuid": "nielslijzenga"
    },
    {
        "config": {},
        "name": "Piet Kuyvenhoven",
        "personalAgentUrl": "http://3rc2.ask-services.appspot.com/eveagents/personalagent/pietkuyvenhoven/",
        "rate": 1,
        "resources": {
            "id": "pietkuyvenhoven",
            "settingsWebPaige": "{\"user\":{\"language\":\"nl\",\"google\":\"\"}}",
            "askPass": "734442e33d8eff4b48b62d603966bdb5",
            "name": "Piet Kuyvenhoven",
            "EmailAddress": "piet@kuyvenhoven.nl",
            "PhoneAddress": "+31651216438",
            "role": "2"
        },
        "state": "com.ask-cs.no planning",
        "uuid": "pietkuyvenhoven"
    },
    {
        "config": {},
        "name": "Florian de Krom",
        "personalAgentUrl": "http://3rc2.ask-services.appspot.com/eveagents/personalagent/floriandekrom/",
        "rate": 1,
        "resources": {
            "id": "floriandekrom",
            "settingsWebPaige": "{\"user\":{\"language\":\"nl\",\"google\":\"\"}}",
            "askPass": "6f2f01fad90eef756729b456e66099ae",
            "name": "Florian de Krom",
            "EmailAddress": "f.krom@caiway.nl",
            "PhoneAddress": "+31624932195",
            "role": "2"
        },
        "state": "com.ask-cs.no planning",
        "uuid": "floriandekrom"
    },
    {
        "config": {},
        "name": "Martijn Koppert",
        "personalAgentUrl": "http://3rc2.ask-services.appspot.com/eveagents/personalagent/martijnkoppert/",
        "rate": 1,
        "resources": {
            "id": "martijnkoppert",
            "settingsWebPaige": "{\"user\":{\"language\":\"nl\",\"google\":\"\"}}",
            "askPass": "10c5df98578a93dc93107e5340009551",
            "name": "Martijn Koppert",
            "EmailAddress": "martijn_westland@hotmail.com",
            "PhoneAddress": "+31619404554",
            "role": "3"
        },
        "state": "com.ask-cs.no planning",
        "uuid": "martijnkoppert"
    },
    {
        "config": {},
        "name": "John van den Enden",
        "personalAgentUrl": "http://3rc2.ask-services.appspot.com/eveagents/personalagent/johnvandenenden/",
        "rate": 1,
        "resources": {
            "id": "johnvandenenden",
            "settingsWebPaige": "{\"user\":{\"language\":\"nl\",\"google\":\"\"}}",
            "askPass": "06903f88d93bc6ef60b4ef3b6217cb25",
            "name": "John van den Enden",
            "EmailAddress": "johnvdenden@hetnet.nl",
            "PhoneAddress": "+31622927514",
            "role": "3"
        },
        "state": "com.ask-cs.no planning",
        "uuid": "johnvandenenden"
    },
    {
        "config": {},
        "name": "Hans v/d Ende",
        "personalAgentUrl": "http://3rc2.ask-services.appspot.com/eveagents/personalagent/hansvandenenden/",
        "rate": 1,
        "resources": {
            "id": "hansvandenenden",
            "settingsWebPaige": "{\"user\":{\"language\":\"nl\",\"google\":\"\"}}",
            "askPass": "ce564f0fd6f685c177f2398c83989d8d",
            "name": "Hans v/d Ende",
            "EmailAddress": "endehena@kabelfoon.nl",
            "PhoneAddress": "+31651991827",
            "role": "3"
        },
        "state": "com.ask-cs.no planning",
        "uuid": "hansvandenenden"
    },
    {
        "config": {},
        "name": "Menno Dreckmeier",
        "personalAgentUrl": "http://3rc2.ask-services.appspot.com/eveagents/personalagent/mennodreckmeier/",
        "rate": 1,
        "resources": {
            "id": "mennodreckmeier",
            "settingsWebPaige": "{\"user\":{\"language\":\"nl\",\"google\":\"\"}}",
            "askPass": "72ef5c56a85242145886a60f4f4c8067",
            "name": "Menno Dreckmeier",
            "EmailAddress": "mennofan2@hotmail.com",
            "PhoneAddress": "+31683395872",
            "role": "3"
        },
        "state": "com.ask-cs.no planning",
        "uuid": "mennodreckmeier"
    },
    {
        "config": {},
        "name": "Richard Dreckmeier",
        "personalAgentUrl": "http://3rc2.ask-services.appspot.com/eveagents/personalagent/richarddreckmeier/",
        "rate": 1,
        "resources": {
            "id": "richarddreckmeier",
            "settingsWebPaige": "{\"user\":{\"language\":\"nl\",\"google\":\"\"}}",
            "askPass": "1f972a875486923e2f4594bbde7849c2",
            "name": "Richard Dreckmeier",
            "EmailAddress": "richard@kdtelematica.nl",
            "PhoneAddress": "+31651664404",
            "role": "2"
        },
        "state": "com.ask-cs.no planning",
        "uuid": "richarddreckmeier"
    },
    {
        "config": {},
        "name": "Christiaan Brienen",
        "personalAgentUrl": "http://3rc2.ask-services.appspot.com/eveagents/personalagent/christiaanbrienen/",
        "rate": 1,
        "resources": {
            "id": "christiaanbrienen",
            "settingsWebPaige": "{\"user\":{\"language\":\"nl\",\"google\":\"\"}}",
            "askPass": "2093e8f3e30054533c78ba528d0039ec",
            "name": "Christiaan Brienen",
            "EmailAddress": "chrbrienen@hotmail.com",
            "PhoneAddress": "+31623754633",
            "role": "3"
        },
        "state": "com.ask-cs.no planning",
        "uuid": "christiaanbrienen"
    },
    {
        "config": {},
        "name": "Benjamin Brienen",
        "personalAgentUrl": "http://3rc2.ask-services.appspot.com/eveagents/personalagent/benjaminbrienen/",
        "rate": 1,
        "resources": {
            "id": "benjaminbrienen",
            "settingsWebPaige": "{\"user\":{\"language\":\"nl\",\"google\":\"\"}}",
            "askPass": "0ac8636d2ff06e74c21fe452d4ca8547",
            "name": "Benjamin Brienen",
            "EmailAddress": "ben_brienen@hotmail.com",
            "PhoneAddress": "+31651240073",
            "role": "3"
        },
        "state": "com.ask-cs.no planning",
        "uuid": "benjaminbrienen"
    },
    {
        "config": {},
        "name": "Henry van den Berg",
        "personalAgentUrl": "http://3rc2.ask-services.appspot.com/eveagents/personalagent/henryvandenberg/",
        "rate": 1,
        "resources": {
            "id": "henryvandenberg",
            "settingsWebPaige": "{\"user\":{\"language\":\"nl\",\"google\":\"\"}}",
            "askPass": "5fef77765eaa932584d3d0f80c8ed557",
            "name": "Henry van den Berg",
            "EmailAddress": "henry.vd.berg@planet.nl",
            "PhoneAddress": "+31621634615",
            "role": "3"
        },
        "state": "com.ask-cs.no planning",
        "uuid": "henryvandenberg"
    }
];

