//@flow
'use strict'

import Cinemas from '../../Pages/Cinemas'

 const TabsRoutes = {
  initialRoute: {
    tabs: {
      index: 0,
      routes: [
        {key: 'cinemas'},
        {key: 'billboard'},
        {key: 'coming_soon'},
      ],
    },
    // Scenes for the `apple` tab.
    cinemas: {
      index: 0,
      routes: [{key: 'Cines', component: Cinemas}],
    },
    // Scenes for the `banana` tab.
    billboard: {
      index: 0,
      routes: [{key: 'Cartelera', component: Cinemas}],
    },
    // Scenes for the `orange` tab.
    coming_soon: {
      index: 0,
      routes: [{key: 'Próximamente', component: Cinemas}],
    },
  }
}

export default TabsRoutes;