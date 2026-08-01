import { useState } from 'react'
import './platformTabs.css'

const PlatformTabs = ({ tabs, defaultTab = 0, children }) => {
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <div className="platform-tabs">
      <div className="tabs-header">
        <div className="tabs-list" role="tablist">
          {tabs.map((tab, index) => (
            <button
              key={index}
              role="tab"
              aria-selected={activeTab === index}
              className={`tab-button ${activeTab === index ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {tab.icon && <img src={tab.icon} alt="" className="tab-icon" />}
              <span>{tab.label}</span>
              {tab.badge && <span className="tab-badge">{tab.badge}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="tabs-content">
        {children && children[activeTab]}
      </div>
    </div>
  )
}

export default PlatformTabs
