//@flow
'use strict'

import TabsNavigator from './TabsNavigator'
import Cinemas from '../Pages/Cinemas'
import Billboard from '../Pages/Billboard'
import Theaters from '../Pages/Theaters'

function GetRoute(key: String, extraProps: Object = null): Object {
  let route = {};
  switch (key) {
    case 'MainTabs':
      route = {
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
      route = {
        key: 'cinemas',
        component: Cinemas,
        title: "Cinemas",
      }
      break;
    case 'Billboard':
      route = {
        key: 'billboard',
        component: Billboard,
        title: 'Cartelera',
      }
      break;
    case 'Theaters':
      route = {
        key: 'theaters',
        component: Theaters,
      }
      break;
    default:
      break;
    route = {...route, ...extraProps};
  }
  return route;
}

export default GetRoute;
