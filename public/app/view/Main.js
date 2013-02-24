Ext.define('Diesel.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'main',
    requires: [
        'Ext.TitleBar',
        'Ext.Video'
    ],
    config: {
        tabBarPosition: 'bottom',

        items: [
            {
                title: 'Welcome',
                iconCls: 'home',

                styleHtmlContent: true,
                scrollable: true,

                items: {
                    docked: 'top',
                    xtype: 'titlebar',
                    title: 'Welcome to DIESEL'
                },

                html: [
                    "Changing the text so we dont look like huge ass noobs"
                ].join("")
            },
            {
                title: 'Get Started',
                iconCls: 'action',

                items: [
                    {
                        docked: 'top',
                        xtype: 'titlebar',
                        title: 'Rollin like Rick'
                    },
                    {
                        // xtype: 'video',
//                         url: 'http://www.youtube.com/watch?v=okqEVeNqBhc',
//                         autoResume: true
						html: '<iframe width="640" height="480" src="http://www.youtube.com/embed/okqEVeNqBhc" frameborder="0" allowfullscreen></iframe>'

                    }
                ]
            },
			{
				title: 'Facebook',
				items: [{
					xtype: 'button'
				}]
			}
        ]
    }
});
