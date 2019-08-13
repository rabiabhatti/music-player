// @flow

import * as React from 'react'

import flex from '~/styles/flex.less'
import privacy from '~/styles/privacy.less'

export default () => (
    <div className={`${privacy.privacyContainer} ${flex.align_center}`}>
        <h2>Our privacy policy</h2>
        <p>Protecting your privacy is all about having control over your data. At <strong>gdrive-music-player</strong>, we help you control and protect what’s yours, we don’t collect any <strong>personal data</strong>.<br /> Our definition of personal data is based on the privacy laws and regulations of the EU, including the General Data Protection Regulation (GDPR). These are widely regarded as the strongest privacy protections in the world. We consider any information about you that can be traced back to you as personal data.</p>
        <ul>
            <li><strong>We don’t record your IP address</strong></li>
            <li><strong>We don’t serve any tracking or identifying cookies</strong></li>
            <li><strong>We locally save your emails and passwords and they are deleted after you log out</strong></li>
        </ul>
    </div>
)
