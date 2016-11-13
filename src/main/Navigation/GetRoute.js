//@flow
'use strict'

import TabsNavigator from './TabsNavigator'
import Cinemas from '../Pages/Cinemas'
import Billboard from '../Pages/Billboard'

function GetRoute(key: String): Object {
  switch (key) {
    case 'MainTabs':
      return {
        index: 0,
        routes: [{
          key: 'tabs',
          component: TabsNavigator,
          tabs: {
            index: 0,
            routes: [
              {
                key: 'tabCinemas',
                title: "Cines"
              },
              {
                key: 'tabBillboard',
                title: "Cartelera"
              }
            ],
          },

          tabCinemas: {
            index: 0,
            routes: [
              GetRoute('Cinemas'),
            ],
          },

          tabBillboard: {
            index: 0,
            routes: [
              GetRoute('Billboard'),
            ],
          },
        }]
      }
      break;
    case 'Cinemas':
      return {
        key: 'cinemas',
        component: Cinemas,
        title: "Cinemas",
      }
      break;
    case 'Billboard':
      return {
        key: 'billboard',
        component: Billboard,
        title: 'Cartelera',
      }
      break;
    default:
      return;
  }
}

export default GetRoute;
