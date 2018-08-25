// @flow

import * as React from 'react'

import '~/css/songs.css'
import '~/css/table.css'

export default class RecentlyPlayed extends React.Component<$FlowFixMe, $FlowFixMe> {
  render() {
    return (
      <div className="section-songs bound">
        <div className="align-center space-between">
          <h2>Recently Played</h2>
          <button>Play All</button>
        </div>
        <table className="section-songs-table" cellSpacing="0">
          <thead>
            <tr className="table-heading">
              <th>Title</th>
              <th>Time</th>
              <th>Artist</th>
              <th>Album</th>
              <th>Genre</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ho ho ho</td>
              <td>3:39</td>
              <td>Sia Furler</td>
              <td>Everyday Is Christmas</td>
              <td>Holiday</td>
            </tr>
            <tr>
              <td>Snowman</td>
              <td>2:48</td>
              <td>Sia Furler</td>
              <td>Everyday Is Christmas</td>
              <td>Holiday</td>
            </tr>
            <tr>
              <td>Everyday Is Christmas</td>
              <td>3:24</td>
              <td>Sia Furler</td>
              <td>Everyday Is Christmas</td>
              <td>Holiday</td>
            </tr>
            <tr>
              <td>Something just like this</td>
              <td>4:21</td>
              <td>Coldplay, The Chainsmokers</td>
              <td>Memories...Do Not Open</td>
              <td>Dance/Electronic</td>
            </tr>
            <tr>
              <td>The one</td>
              <td>2:57</td>
              <td>The Chainsmokers</td>
              <td>Memories...Do Not Open</td>
              <td>Dance/Electronic</td>
            </tr>
            <tr>
              <td>Mind of mindd</td>
              <td>0:57</td>
              <td>Zayn Malik</td>
              <td>Mind of Mine</td>
              <td>Pop</td>
            </tr>
            <tr>
              <td>Ho ho ho</td>
              <td>3:39</td>
              <td>Sia Furler</td>
              <td>Everyday Is Christmas</td>
              <td>Holiday</td>
            </tr>
            <tr>
              <td>Snowman</td>
              <td>2:48</td>
              <td>Sia Furler</td>
              <td>Everyday Is Christmas</td>
              <td>Holiday</td>
            </tr>
            <tr>
              <td>Everyday Is Christmas</td>
              <td>3:24</td>
              <td>Sia Furler</td>
              <td>Everyday Is Christmas</td>
              <td>Holiday</td>
            </tr>
            <tr>
              <td>Something just like this</td>
              <td>4:21</td>
              <td>Coldplay, The Chainsmokers</td>
              <td>Memories...Do Not Open</td>
              <td>Dance/Electronic</td>
            </tr>
            <tr>
              <td>The one</td>
              <td>2:57</td>
              <td>The Chainsmokers</td>
              <td>Memories...Do Not Open</td>
              <td>Dance/Electronic</td>
            </tr>
            <tr>
              <td>Mind of mindd</td>
              <td>0:57</td>
              <td>Zayn Malik</td>
              <td>Mind of Mine</td>
              <td>Pop</td>
            </tr>
            <tr>
              <td>Ho ho ho</td>
              <td>3:39</td>
              <td>Sia Furler</td>
              <td>Everyday Is Christmas</td>
              <td>Holiday</td>
            </tr>
            <tr>
              <td>Snowman</td>
              <td>2:48</td>
              <td>Sia Furler</td>
              <td>Everyday Is Christmas</td>
              <td>Holiday</td>
            </tr>
            <tr>
              <td>Everyday Is Christmas</td>
              <td>3:24</td>
              <td>Sia Furler</td>
              <td>Everyday Is Christmas</td>
              <td>Holiday</td>
            </tr>
            <tr>
              <td>Something just like this</td>
              <td>4:21</td>
              <td>Coldplay, The Chainsmokers</td>
              <td>Memories...Do Not Open</td>
              <td>Dance/Electronic</td>
            </tr>
            <tr>
              <td>The one</td>
              <td>2:57</td>
              <td>The Chainsmokers</td>
              <td>Memories...Do Not Open</td>
              <td>Dance/Electronic</td>
            </tr>
            <tr>
              <td>lastMind of mindd</td>
              <td>0:57</td>
              <td>Zayn Malik</td>
              <td>Mind of Mine</td>
              <td>Pop</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
