/**
 * Installation profile
 */
var profile = {

  meta: 'knrm',

  title: 'KNRM',

  host: function ()
  {
    return ($.browser.msie) ? '/proxy/ns_knrm' : 'http://3rc2.ask-services.appspot.com/ns_knrm';
  },

  states: [
    'com.ask-cs.State.Available',
    'com.ask-cs.State.KNRM.BeschikbaarNoord',
    'com.ask-cs.State.KNRM.BeschikbaarZuid',
    'com.ask-cs.State.Unavailable',
    'com.ask-cs.State.KNRM.SchipperVanDienst',
    'com.ask-cs.State.Unreached'
  ],

  timeline: {
    config: {
      layouts: {
        groups:   true,
        members:  true
      }
    }
  },

  divisions: [
    {
      id: 'all',
      label: 'Beide stations'
    }, 
    {
      id: 'knrm.StateGroup.BeschikbaarNoord',
      label: 'Noord'
    }, 
    {
      id: 'knrm.StateGroup.BeschikbaarZuid',
      label: 'Zuid'
    }
  ],

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
    url:    'http://knrm.myask.me/rpc/client/p2000.php',
    codes:  '1405545, 1405546, 1735749, 1735748'
  },

  mobileApp: {
    status:   true
  },

  analytics: {
    status: true,
    code:   function ()
    {
      var _gaq = _gaq || [];
      _gaq.push(['_setAccount',     'UA-36532309-1']);
      _gaq.push(['_setDomainName',  'ask-cs.com']);
      _gaq.push(['_setAllowLinker', true]);
      _gaq.push(['_trackPageview']);
      (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
      })();
    }
  }
};








































/**
 * Demo users for testing
 */
var demo_users = [
    {
        "config": {},
        "name": "Chris  2Aldewereld",
        "personalAgentUrl": "http://sven.ask-services.appspot.com/eveagents/personalagent/4780aldewereld/",
        "rate": 1,
        "resources": {
            "id": "4780aldewereld",
            "askPass": "d9a6c9bad827746190792cf6f30d5271",
            "name": "Chris  2Aldewereld",
            "PhoneAddress": "+31648204528",
            "role": "3"
        },
        "state": "com.ask-cs.State.NoPlanning",
        "uuid": "4780aldewereld"
    },
    {
        "config": {},
        "name": "Joost  1 Smits",
        "personalAgentUrl": "http://sven.ask-services.appspot.com/eveagents/personalagent/4781smits/",
        "rate": 1,
        "resources": {
            "id": "4781smits",
            "askPass": "2d648681d9352378a5e567f08eaf9677",
            "name": "Joost  1 Smits",
            "PhoneAddress": "+31634458934",
            "role": "3"
        },
        "state": "com.ask-cs.State.NoPlanning",
        "uuid": "4781smits"
    },
    {
        "config": {},
        "name": "Mario  Vroon",
        "personalAgentUrl": "http://sven.ask-services.appspot.com/eveagents/personalagent/4783vroon/",
        "rate": 1,
        "resources": {
            "id": "4783vroon",
            "askPass": "d3745e9ed55d046445dda6ed33d0b660",
            "name": "Mario  Vroon",
            "PhoneAddress": "+31642479178",
            "role": "2"
        },
        "state": "com.ask-cs.State.NoPlanning",
        "uuid": "4783vroon"
    },
    {
        "config": {},
        "name": "Robert  1 Faase",
        "personalAgentUrl": "http://sven.ask-services.appspot.com/eveagents/personalagent/4782faase/",
        "rate": 1,
        "resources": {
            "id": "4782faase",
            "askPass": "29530e3085d6b3df773b4e1090605053",
            "name": "Robert  1 Faase",
            "PhoneAddress": "+31652588740",
            "role": "3"
        },
        "state": "com.ask-cs.State.NoPlanning",
        "uuid": "4782faase"
    },
    {
        "config": {},
        "name": "Michiel  1 Wondergem",
        "personalAgentUrl": "http://sven.ask-services.appspot.com/eveagents/personalagent/4534wondergem/",
        "rate": 1,
        "resources": {
            "id": "4534wondergem",
            "askPass": "8efb377daa5134ddbf895c1bdaf99415",
            "name": "Michiel  1 Wondergem",
            "PhoneAddress": "+31650909756",
            "role": "3"
        },
        "state": "com.ask-cs.State.NoPlanning",
        "uuid": "4534wondergem"
    },
    {
        "config": {},
        "name": "apptest  knrm",
        "personalAgentUrl": "http://sven.ask-services.appspot.com/eveagents/personalagent/apptestknrm/",
        "rate": 1,
        "resources": {
            "id": "apptestknrm",
            "askPass": "eadeb77d8fba90b42b32b7de13e8aaa6",
            "name": "apptest  knrm",
            "EmailAddress": "dferro@ask-cs.com",
            "PhoneAddress": "+31627033823",
            "role": "1"
        },
        "state": "com.ask-cs.State.NoPlanning",
        "uuid": "apptestknrm"
    },
    {
        "config": {},
        "name": "Cengiz TEST",
        "personalAgentUrl": "http://sven.ask-services.appspot.com/eveagents/personalagent/apptestknrm/",
        "rate": 1,
        "resources": {
            "id": "culusoy@ask-cs.com",
            "askPass": "eadeb77d8fba90b42b32b7de13e8aaa6",
            "name": "apptest  knrm",
            "EmailAddress": "dferro@ask-cs.com",
            "PhoneAddress": "+31627033823",
            "role": "1"
        },
        "state": "com.ask-cs.State.NoPlanning",
        "uuid": "apptestknrm"
    },
    {
        "config": {},
        "name": "Joris  2Rietveld",
        "personalAgentUrl": "http://sven.ask-services.appspot.com/eveagents/personalagent/4641rietveld/",
        "rate": 1,
        "resources": {
            "id": "4641rietveld",
            "askPass": "8aafe6da6bfdda3ea926d60d0fcb612b",
            "name": "Joris  2Rietveld",
            "PhoneAddress": "+31681539352",
            "role": "3"
        },
        "state": "com.ask-cs.State.NoPlanning",
        "uuid": "4641rietveld"
    },
    {
        "config": {},
        "name": "Peter  Kuiphof",
        "personalAgentUrl": "http://sven.ask-services.appspot.com/eveagents/personalagent/4640kuiphof/",
        "rate": 1,
        "resources": {
            "id": "4640kuiphof",
            "askPass": "8b9d6e5c2cab60fb8b044c7bf1acb9a9",
            "name": "Peter  Kuiphof",
            "PhoneAddress": "+31651262411",
            "role": "3"
        },
        "state": "com.ask-cs.State.NoPlanning",
        "uuid": "4640kuiphof"
    },
    // {
    //     "config": {},
    //     "name": "Schippers  GSM",
    //     "personalAgentUrl": "http://sven.ask-services.appspot.com/eveagents/personalagent//",
    //     "rate": 1,
    //     "resources": {
    //         "id": "",
    //         "name": "Schippers  GSM",
    //         "PhoneAddress": "+31646140402",
    //         "role": "3"
    //     },
    //     "state": "com.ask-cs.State.NoPlanning",
    //     "uuid": ""
    // },
    {
        "config": {},
        "name": "Gerben  1Hop",
        "personalAgentUrl": "http://sven.ask-services.appspot.com/eveagents/personalagent/4350hop/",
        "rate": 1,
        "resources": {
            "id": "4350hop",
            "askPass": "d2247713b3faf06b07f4c69e8850c8b6",
            "name": "Gerben  1Hop",
            "PhoneAddress": "+31651313950",
            "role": "3"
        },
        "state": "com.ask-cs.State.NoPlanning",
        "uuid": "4350hop"
    },
    {
        "config": {},
        "name": "Rolph  2 Herks",
        "personalAgentUrl": "http://sven.ask-services.appspot.com/eveagents/personalagent/4173herks/",
        "rate": 1,
        "resources": {
            "id": "4173herks",
            "askPass": "61fb6976d8b0a5356760ab666d5d62c6",
            "name": "Rolph  2 Herks",
            "PhoneAddress": "+31611225522",
            "role": "2"
        },
        "state": "com.ask-cs.State.NoPlanning",
        "uuid": "4173herks"
    },
    {
        "config": {},
        "name": "Floris  1Visser",
        "personalAgentUrl": "http://sven.ask-services.appspot.com/eveagents/personalagent/4056visser/",
        "rate": 1,
        "resources": {
            "id": "4056visser",
            "askPass": "92a091ddab4daf576643bd29a50b1603",
            "name": "Floris  1Visser",
            "PhoneAddress": "+31613573885",
            "role": "2"
        },
        "state": "com.ask-cs.State.NoPlanning",
        "uuid": "4056visser"
    },
    {
        "config": {},
        "name": "Remco  2Verwaal",
        "personalAgentUrl": "http://sven.ask-services.appspot.com/eveagents/personalagent/4179verwaal/",
        "rate": 1,
        "resources": {
            "id": "4179verwaal",
            "askPass": "80975550806eb4c9abaf7bb3d6cd4868",
            "name": "Remco  2Verwaal",
            "PhoneAddress": "+31652052024",
            "role": "2"
        },
        "state": "com.ask-cs.State.NoPlanning",
        "uuid": "4179verwaal"
    },
    {
        "config": {},
        "name": "Lennard  2Theunisse",
        "personalAgentUrl": "http://sven.ask-services.appspot.com/eveagents/personalagent/4059theunisse/",
        "rate": 1,
        "resources": {
            "id": "4059theunisse",
            "askPass": "f5212ff3f9bac5439368462f2e791558",
            "name": "Lennard  2Theunisse",
            "PhoneAddress": "+31619348536",
            "role": "3"
        },
        "state": "com.ask-cs.State.NoPlanning",
        "uuid": "4059theunisse"
    },
    {
        "config": {},
        "name": "Johan  1Schouwenaar",
        "personalAgentUrl": "http://sven.ask-services.appspot.com/eveagents/personalagent/4171schouwenaar/",
        "rate": 1,
        "resources": {
            "id": "4171schouwenaar",
            "askPass": "b48406b7c7d88252468b62a54ccfa3ad",
            "name": "Johan  1Schouwenaar",
            "PhoneAddress": "+31620300692",
            "role": "1"
        },
        "state": "com.ask-cs.State.NoPlanning",
        "uuid": "4171schouwenaar"
    },
    {
        "config": {},
        "name": "Marco  1Prins",
        "personalAgentUrl": "http://sven.ask-services.appspot.com/eveagents/personalagent/4176prins/",
        "rate": 1,
        "resources": {
            "id": "4176prins",
            "askPass": "a5e10524dda9887ddb4efcee847e3a71",
            "name": "Marco  1Prins",
            "PhoneAddress": "+31651325066",
            "role": "3"
        },
        "state": "com.ask-cs.State.NoPlanning",
        "uuid": "4176prins"
    },
    {
        "config": {},
        "name": "Erik  2 van den Oever",
        "personalAgentUrl": "http://sven.ask-services.appspot.com/eveagents/personalagent/4057oever/",
        "rate": 1,
        "resources": {
            "id": "4057oever",
            "askPass": "fb0d51f344ff62db41260f958d320e63",
            "name": "Erik  2 van den Oever",
            "PhoneAddress": "+31653131607",
            "role": "2"
        },
        "state": "com.ask-cs.State.NoPlanning",
        "uuid": "4057oever"
    },
    {
        "config": {},
        "name": "Henk  2van der Meij",
        "personalAgentUrl": "http://sven.ask-services.appspot.com/eveagents/personalagent/4085meij/",
        "rate": 1,
        "resources": {
            "id": "4085meij",
            "askPass": "62d611788f7e38472db2c6836612e1c3",
            "name": "Henk  2van der Meij",
            "PhoneAddress": "+31648270131",
            "role": "3"
        },
        "state": "com.ask-cs.State.NoPlanning",
        "uuid": "4085meij"
    },
    {
        "config": {},
        "name": "Michael  2Hooijschuur",
        "personalAgentUrl": "http://sven.ask-services.appspot.com/eveagents/personalagent/4178hooijschuur/",
        "rate": 1,
        "resources": {
            "id": "4178hooijschuur",
            "askPass": "00c84a18619700858ebfd435e47de17e",
            "name": "Michael  2Hooijschuur",
            "PhoneAddress": "+31621243519",
            "role": "3"
        },
        "state": "com.ask-cs.State.NoPlanning",
        "uuid": "4178hooijschuur"
    },
    {
        "config": {},
        "name": "Robert  1 Herks",
        "personalAgentUrl": "http://sven.ask-services.appspot.com/eveagents/personalagent/4129herks/",
        "rate": 1,
        "resources": {
            "id": "4129herks",
            "askPass": "f5212ff3f9bac5439368462f2e791558",
            "name": "Robert  1 Herks",
            "PhoneAddress": "+31625321827",
            "role": "2"
        },
        "state": "com.ask-cs.State.NoPlanning",
        "uuid": "4129herks"
    },
    {
        "config": {},
        "name": "Jeroen  2Fok",
        "personalAgentUrl": "http://sven.ask-services.appspot.com/eveagents/personalagent/4058fok/",
        "rate": 1,
        "resources": {
            "id": "4058fok",
            "askPass": "288116504f5e303e4be4ff1765b81f5d",
            "name": "Jeroen  2Fok",
            "PhoneAddress": "+31653508293",
            "role": "2"
        },
        "state": "com.ask-cs.State.NoPlanning",
        "uuid": "4058fok"
    },
    {
        "config": {},
        "name": "Wim  1Durinck",
        "personalAgentUrl": "http://sven.ask-services.appspot.com/eveagents/personalagent/4170durinck/",
        "rate": 1,
        "resources": {
            "id": "4170durinck",
            "askPass": "f5212ff3f9bac5439368462f2e791558",
            "name": "Wim  1Durinck",
            "PhoneAddress": " 31653239466",
            "role": "3"
        },
        "state": "com.ask-cs.State.NoPlanning",
        "uuid": "4170durinck"
    },
    {
        "config": {},
        "name": "Arjen  1 de Bruin",
        "personalAgentUrl": "http://sven.ask-services.appspot.com/eveagents/personalagent/4125bruin/",
        "rate": 1,
        "resources": {
            "id": "4125bruin",
            "askPass": "a6988b18b93b884a8bb9aecef6b939c3",
            "name": "Arjen  1 de Bruin",
            "PhoneAddress": "+31654745489",
            "role": "3"
        },
        "state": "com.ask-cs.State.NoPlanning",
        "uuid": "4125bruin"
    },
    {
        "config": {},
        "name": "Andries  1Boneschansker",
        "personalAgentUrl": "http://sven.ask-services.appspot.com/eveagents/personalagent/4128boneschansker/",
        "rate": 1,
        "resources": {
            "id": "4128boneschansker",
            "askPass": "bbe207afad476fb61826071780defea9",
            "name": "Andries  1Boneschansker",
            "PhoneAddress": "+31681795624",
            "role": "3"
        },
        "state": "com.ask-cs.State.NoPlanning",
        "uuid": "4128boneschansker"
    }
];

