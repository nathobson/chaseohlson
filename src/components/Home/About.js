import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Container from '../UI/Container';
import axios from 'axios';
import endpoints from '../../util/endpoints';
import LoadingIcon from '../../images/loading.svg';
import ReactAudioPlayer from 'react-audio-player';

const AboutWrapper = styled.div`
  margin: 10rem 0;
  section {
    flex-direction: column;
    width: 1020px;
    max-width: 100%;
    h2 {
      color: ${props => props.theme.colors.red};
      margin-bottom: 2rem;
    }
    h3 {
      color: ${props => props.theme.colors.red};
      margin: 2rem 0;
      display: flex;
      align-items: center;
      button {
        background: transparent !important;
        border: 0.1px solid ${props => props.theme.colors.black};
        font-family: ${props => props.theme.fonts.robo};
        font-size: 1.2rem;
        margin-left: 1rem;
        margin-top: 0.3rem;
        &:focus {
          outline: 5px auto ${props => props.theme.colors.red};
        }
      }
    }
    small {
      font-size: 1rem;
      line-height: 1rem;
    }
    .listening {
    }
    .body {
      a {
        position: relative;
        z-index: 5;
        text-decoration: none;
        color: white;
        transition: all 0.3s ease;
        padding: 0 0.5rem;
        &:hover {
          color: ${props => props.theme.colors.black};
          &::before {
            height: 2px;
            width: 100%;
            opacity: 1;
          }
        }
        &::before {
          z-index: -5;
          content: '';
          position: absolute;
          height: 100%;
          width: 100%;
          bottom: -1px;
          left: 0;
          opacity: 1;
          transition: all 0.3s ease;
          background: ${props => props.theme.gradients.red};
        }
      }
    }
    small {
      a {
        position: relative;
        z-index: 5;
        text-decoration: none;
        color: white;
        transition: all 0.3s ease;
        padding: 0.25rem 0.5rem 0.15rem 0.5rem;
        &:hover {
          color: ${props => props.theme.colors.black};
          &::before {
            height: 2px;
            width: 100%;
            opacity: 1;
          }
        }
        &::before {
          z-index: -5;
          content: '';
          position: absolute;
          height: 100%;
          width: 100%;
          bottom: -1px;
          left: 0;
          opacity: 1;
          transition: all 0.3s ease;
          background: ${props => props.theme.gradients.red};
        }
      }
    }
  }
`;

const PlayerWrapper = styled.div`
  .loading {
    min-height: 115px;
    @media screen and (max-width: ${props => props.theme.sizes.mobile}) {
      min-height: 132px;
    }
  }
`;

export default class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      track: {},
      error: false,
      fetching: true,
    };
  }
  static propTypes = {
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
  };
  componentDidMount() {
    this.getTrack();
  }
  getTrack = () => {
    this.setState({ fetching: true });

    axios
      .get(endpoints.spotify)
      .then(res => {
        let { name, href, preview_url, artists } = res.data;
        if (preview_url) {
          this.setState({
            fetching: false,
            error: false,
            track: {
              name,
              href,
              preview_url,
              artist: artists[0].name,
            },
          });
        } else {
          this.setState({ error: true, fetching: false, track: {} });
        }
      })
      .catch(() => {
        this.setState({ error: true, fetching: false, track: {} });
      });
  };

  renderPlayer = () => {
    let { fetching, error, track } = this.state;
    return (
      <PlayerWrapper>
        {fetching && (
          <div className="loading">
            <img alt="loading" src={LoadingIcon} />
          </div>
        )}
        {!error && !fetching && track.preview_url && (
          <div className="wrap">
            <div className="title">
              <p>
                <strong>{track.artist || 'Artist'}</strong> -{' '}
                {track.name || 'Track'}
              </p>
            </div>
            <div className="player">
              <ReactAudioPlayer src={track.preview_url} controls />
            </div>
            <div className="notes">
              <small>
                * Track generated by the{' '}
                <a
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  href="https://developer.spotify.com/documentation/web-api/"
                >
                  Spotify API
                </a>{' '}
                from one of my recent playlists.
              </small>
            </div>
          </div>
        )}
      </PlayerWrapper>
    );
  };
  render() {
    let { title, body } = this.props;
    let { error } = this.state;
    return (
      <AboutWrapper id="about">
        <Container>
          <div className="title">
            <h2>{title}</h2>
          </div>
          <div
            className="body"
            dangerouslySetInnerHTML={{
              __html: body,
            }}
          />
          {!error && (
            <div className="listening">
              <h3>
                Now Playing (Probably){' '}
                <button onClick={this.getTrack}>Refresh</button>
              </h3>
              {this.renderPlayer()}
            </div>
          )}
        </Container>
      </AboutWrapper>
    );
  }
}

About.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
};
