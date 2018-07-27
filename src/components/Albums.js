// @flow

import * as React from 'react'

import AlbumInfo from './AlbumInfo'

import cover from '../static/img/album-cover.jpg'
import cover2 from '../static/img/album-cover-2.jpg'
import cover3 from '../static/img/album-cover-3.png'
import cover4 from '../static/img/album-cover-4.jpg'

type Props = {||}
type State = {||}

export default class Albums extends React.Component<Props, State> {
  render() {
    return (
      <div className="section-albums bound">
        <div className="section-albums-container">
          <div className="album-content">
            <div className="album-cover">
              <div className="album-cover-filter" />
              <img alt="album-cover" className="album-cover-img" src={cover} />
              <button className="album-cover-icon">
                <i className="material-icons">play_circle_outline</i>
              </button>
            </div>
            <div className="album-infomation">
              <h4 className="album-name">Everyday Is Christmas</h4>
              <p className="album-artist">Sia Furler</p>
            </div>
            {/* <div className="arrow_box" /> */}
          </div>
          <div className="album-content">
            <div className="album-cover">
              <div className="album-cover-filter" />
              <img alt="album-cover" className="album-cover-img" src={cover2} />
              <button className="album-cover-icon">
                <i className="material-icons">play_circle_outline</i>
              </button>
            </div>
            <div className="album-info">
              <h4 className="album-name">Memories...Do Not Open</h4>
              <p className="album-artist">Coldplay, The Chainsmokers</p>
            </div>
          </div>
          <div className="album-content">
            <div className="album-cover">
              <div className="album-cover-filter" />
              <img alt="album-cover" className="album-cover-img" src={cover3} />
              <button className="album-cover-icon">
                <i className="material-icons">play_circle_outline</i>
              </button>
            </div>
            <div className="album-info">
              <h4 className="album-name">Mind of Mine</h4>
              <p className="album-artist">Zayn Malik</p>
            </div>
          </div>
          <div className="album-content">
            <div className="album-cover">
              <div className="album-cover-filter" />
              <img alt="album-cover" className="album-cover-img" src={cover4} />
              <button className="album-cover-icon">
                <i className="material-icons">play_circle_outline</i>
              </button>
            </div>
            <div className="album-info">
              <h4 className="album-name">1989</h4>
              <p className="album-artist">Taylor Swift</p>
            </div>
          </div>
          <div className="album-content">
            <div className="album-cover">
              <div className="album-cover-filter" />
              <img alt="album-cover" className="album-cover-img" src={cover3} />
              <button className="album-cover-icon">
                <i className="material-icons">play_circle_outline</i>
              </button>
            </div>
            <div className="album-info">
              <h4 className="album-name">Mind of Mine</h4>
              <p className="album-artist">Zayn Malik</p>
            </div>
          </div>
          <AlbumInfo cover={cover} name="Everyday Is Christmas" artist="Sia Furler" genre="Holiday" year={1234} />
          <div className="album-content">
            <div className="album-cover">
              <div className="album-cover-filter" />
              <img alt="album-cover" className="album-cover-img" src={cover4} />
              <button className="album-cover-icon">
                <i className="material-icons">play_circle_outline</i>
              </button>
            </div>
            <div className="album-info">
              <h4 className="album-name">1989</h4>
              <p className="album-artist">Taylor Swift</p>
            </div>
          </div>
          <div className="album-content">
            <div className="album-cover">
              <div className="album-cover-filter" />
              <img alt="album-cover" className="album-cover-img" src={cover2} />
              <button className="album-cover-icon">
                <i className="material-icons">play_circle_outline</i>
              </button>
            </div>
            <div className="album-info">
              <h4 className="album-name">Memories...Do Not Open</h4>
              <p className="album-artist">Coldplay, The Chainsmokers</p>
            </div>
          </div>
          <div className="album-content">
            <div className="album-cover">
              <div className="album-cover-filter" />
              <img alt="album-cover" className="album-cover-img" src={cover} />
              <button className="album-cover-icon">
                <i className="material-icons">play_circle_outline</i>
              </button>
            </div>
            <div className="album-info">
              <h4 className="album-name">Everyday Is Christmas</h4>
              <p className="album-artist">Sia Furler</p>
            </div>
          </div>
          <div className="album-content">
            <div className="album-cover">
              <div className="album-cover-filter" />
              <img alt="album-cover" className="album-cover-img" src={cover2} />
              <button className="album-cover-icon">
                <i className="material-icons">play_circle_outline</i>
              </button>
            </div>
            <div className="album-info">
              <h4 className="album-name">Memories...Do Not Open</h4>
              <p className="album-artist">Coldplay, The Chainsmokers</p>
            </div>
          </div>
          <div className="album-content">
            <div className="album-cover">
              <div className="album-cover-filter" />
              <img alt="album-cover" className="album-cover-img" src={cover3} />
              <button className="album-cover-icon">
                <i className="material-icons">play_circle_outline</i>
              </button>
            </div>
            <div className="album-info">
              <h4 className="album-name">Mind of Mine</h4>
              <p className="album-artist">Zayn Malik</p>
            </div>
          </div>
          <div className="album-content">
            <div className="album-cover">
              <div className="album-cover-filter" />
              <img alt="album-cover" className="album-cover-img" src={cover4} />
              <button className="album-cover-icon">
                <i className="material-icons">play_circle_outline</i>
              </button>
            </div>
            <div className="album-info">
              <h4 className="album-name">1989</h4>
              <p className="album-artist">Taylor Swift</p>
            </div>
          </div>
          <div className="album-content">
            <div className="album-cover">
              <div className="album-cover-filter" />
              <img alt="album-cover" className="album-cover-img" src={cover} />
              <button className="album-cover-icon">
                <i href="#" className="material-icons">
                  play_circle_outline
                </i>
              </button>
            </div>
            <div className="album-info">
              <h4 className="album-name">Everyday Is Christmas</h4>
              <p className="album-artist">Sia Furler</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
