const React = require('react')
const ReactDOM = require('react-dom')
const { Toggle, Paper, RaisedButton } = require('material-ui')
const {
  ColorPickerButton,
  Flexbox: { Row, Col }
} = require('../../Components')
const flux = {
  settings: require('../../stores/settings')
}

module.exports = React.createClass({
  displayName: 'GeneralSettings',

  /* **************************************************************************/
  // Lifecycle
  /* **************************************************************************/

  componentDidMount () {
    flux.settings.S.listen(this.settingsChanged)
    ReactDOM.findDOMNode(this.refs.defaultDownloadInput).setAttribute('webkitdirectory', 'webkitdirectory')
  },

  componentWillUnmount () {
    flux.settings.S.unlisten(this.settingsChanged)
  },

  componentDidUpdate () {
    ReactDOM.findDOMNode(this.refs.defaultDownloadInput).setAttribute('webkitdirectory', 'webkitdirectory')
  },

  /* **************************************************************************/
  // Data lifecycle
  /* **************************************************************************/

  /**
  * Generates the state from the settings
  * @param store=settingsStore: the store to use
  */
  generateState (store = flux.settings.S.getState()) {
    return {
      showTitlebar: store.showTitlebar(),
      showAppBadge: store.showAppBadge(),
      showAppMenu: store.showAppMenu(),
      sidebarEnabled: store.sidebarEnabled(),

      showTrayIcon: store.showTrayIcon(),
      showTrayUnreadCount: store.showTrayUnreadCount(),
      trayReadColor: store.trayReadColor(),
      trayUnreadColor: store.trayUnreadColor(),

      spellcheckerEnabled: store.spellcheckerEnabled(),

      notificationsEnabled: store.notificationsEnabled(),
      notificationsSilent: store.notificationsSilent(),

      alwaysAskDownloadLocation: store.alwaysAskDownloadLocation(),
      defaultDownloadLocation: store.defaultDownloadLocation(),
      openLinksInBackground: store.openLinksInBackground()
    }
  },

  getInitialState () {
    return this.generateState()
  },

  settingsChanged (store) {
    this.setState(this.generateState(store))
  },

  /* **************************************************************************/
  // Rendering
  /* **************************************************************************/

  /**
  * Renders the app
  */
  render () {
    return (
      <div {...this.props}>
        <Paper zDepth={1} style={{ padding: 15, marginBottom: 5 }}>
          <Row>
            <Col sm={6}>
              {process.platform !== 'darwin' ? undefined : (
                <Toggle
                  labelPosition='right'
                  toggled={this.state.showTitlebar}
                  label='Show titlebar (Requires Restart)'
                  onToggle={(evt, toggled) => flux.settings.A.setShowTitlebar(toggled)} />
                )}
              {process.platform === 'darwin' ? undefined : (
                <Toggle
                  labelPosition='right'
                  toggled={this.state.showAppMenu}
                  label='Show App Menu'
                  onToggle={(evt, toggled) => flux.settings.A.setShowAppMenu(toggled)} />
              )}
              <Toggle
                toggled={this.state.sidebarEnabled}
                label='Show sidebar'
                labelPosition='right'
                onToggle={(evt, toggled) => flux.settings.A.setEnableSidebar(toggled)} />
            </Col>
            <Col sm={6}>
              <Toggle
                toggled={this.state.showAppBadge}
                label='Show app unread badge'
                labelPosition='right'
                onToggle={(evt, toggled) => flux.settings.A.setShowAppBadge(toggled)} />
              <Toggle
                toggled={this.state.openLinksInBackground}
                label='Open links in background'
                labelPosition='right'
                onToggle={(evt, toggled) => flux.settings.A.setOpenLinksInBackground(toggled)} />
            </Col>
          </Row>
        </Paper>
        <Paper zDepth={1} style={{ padding: 15, marginBottom: 5 }}>
          <Row>
            <Col sm={6}>
              <Toggle
                toggled={this.state.showTrayIcon}
                label='Show tray icon'
                labelPosition='right'
                onToggle={(evt, toggled) => flux.settings.A.setShowTrayIcon(toggled)} />
              <Toggle
                toggled={this.state.showTrayUnreadCount}
                label='Show unread count in tray'
                labelPosition='right'
                disabled={!this.state.showTrayIcon}
                onToggle={(evt, toggled) => flux.settings.A.setShowTrayUnreadCount(toggled)} />
            </Col>
            <Col sm={6}>
              <div>
                <ColorPickerButton
                  label='Tray read colour'
                  disabled={!this.state.showTrayIcon}
                  value={this.state.trayReadColor}
                  onChange={(col) => flux.settings.A.setTrayReadColor(col.hex)} />
              </div>
              <br />
              <div>
                <ColorPickerButton
                  label='Tray unread colour'
                  disabled={!this.state.showTrayIcon}
                  value={this.state.trayUnreadColor}
                  onChange={(col) => flux.settings.A.setTrayUnreadColor(col.hex)} />
              </div>
            </Col>
          </Row>
        </Paper>
        <Paper zDepth={1} style={{ padding: 15, marginTop: 5, marginBottom: 5 }}>
          <Toggle
            toggled={this.state.spellcheckerEnabled}
            labelPosition='right'
            label='Spell-checker (requires restart)'
            onToggle={(evt, toggled) => flux.settings.A.setEnableSpellchecker(toggled)} />
        </Paper>
        <Paper zDepth={1} style={{ padding: 15, marginTop: 5, marginBottom: 5 }}>
          <Toggle
            toggled={this.state.notificationsEnabled}
            labelPosition='right'
            label='Show new mail notifications'
            onToggle={(evt, toggled) => flux.settings.A.setNotificationsEnabled(toggled)} />
          <br />
          <Toggle
            toggled={!this.state.notificationsSilent}
            label='Play notification sound'
            labelPosition='right'
            disabled={!this.state.notificationsEnabled}
            onToggle={(evt, toggled) => flux.settings.A.setNotificationsSilent(!toggled)} />
        </Paper>
        <Paper zDepth={1} style={{ padding: 15, marginTop: 5, marginBottom: 5 }}>
          <div>
            <Toggle
              toggled={this.state.alwaysAskDownloadLocation}
              label='Always ask download location'
              labelPosition='right'
              onToggle={(evt, toggled) => flux.settings.A.setAlwaysAskDownloadLocation(toggled)} />
            <br />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <RaisedButton
              label='Select location'
              className='file-button'
              disabled={this.state.alwaysAskDownloadLocation}
              style={{ marginRight: 15 }}>
              <input
                type='file'
                ref='defaultDownloadInput'
                disabled={this.state.alwaysAskDownloadLocation}
                onChange={(evt) => flux.settings.A.setDefaultDownloadLocation(evt.target.files[0].path)} />
            </RaisedButton>
            {this.state.alwaysAskDownloadLocation ? undefined : <small>{this.state.defaultDownloadLocation}</small>}
          </div>
        </Paper>
      </div>
    )
  }
})
