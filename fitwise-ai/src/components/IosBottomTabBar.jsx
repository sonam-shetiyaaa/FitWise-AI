import React from 'react';
import { useApp } from '../context/AppContext';
import { iosFeedback } from '../utils/iosHaptics';
import {
  LayoutGrid,
  MessageSquare,
  ClipboardList,
  Settings
} from 'lucide-react';

export const IosBottomTabBar = () => {
  const { currentPage, navigateTo } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'coach', label: 'AI Coach', icon: MessageSquare },
    { id: 'plans', label: 'Plans', icon: ClipboardList },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id) => {
    iosFeedback.playIosClick(1200);
    iosFeedback.triggerHaptic('selection');
    navigateTo(id);
  };

  return (
    <nav className="ios-mobile-tab-bar" aria-label="Mobile Navigation">
      <div className="ios-tab-bar-container">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentPage === item.id ||
            (item.id === 'coach' && currentPage === 'chatbot') ||
            (item.id === 'settings' && currentPage === 'profile-setup');

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`ios-tab-btn ${isActive ? 'active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="ios-tab-icon-wrap">
                <Icon size={20} className="ios-tab-icon" />
                {isActive && <div className="ios-tab-glow" />}
              </div>
              <span className="ios-tab-label">{item.label}</span>
            </button>
          );
        })}
      </div>

      <style>{`
        .ios-mobile-tab-bar {
          display: none;
        }

        @media (max-width: 768px) {
          .ios-mobile-tab-bar {
            display: block;
            position: fixed;
            bottom: 14px;
            left: 50%;
            transform: translateX(-50%);
            width: calc(100% - 24px);
            max-width: 420px;
            z-index: 9980;
            user-select: none;
          }

          .ios-tab-bar-container {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 4px;
            background: rgba(14, 20, 16, 0.88);
            backdrop-filter: blur(32px) saturate(200%);
            -webkit-backdrop-filter: blur(32px) saturate(200%);
            border: 0.5px solid rgba(255, 255, 255, 0.16);
            border-radius: 26px;
            padding: 6px 8px;
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.12);
          }

          .ios-tab-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 3px;
            padding: 6px 2px;
            background: transparent;
            border: none;
            border-radius: 18px;
            cursor: pointer;
            transition: all 0.18s cubic-bezier(0.32, 0.72, 0, 1);
            color: #8e8e93;
            font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif;
            position: relative;
          }

          .ios-tab-btn:active {
            transform: scale(0.92);
          }

          .ios-tab-icon-wrap {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .ios-tab-icon {
            transition: transform 0.2s ease, color 0.2s ease;
          }

          .ios-tab-btn.active .ios-tab-icon {
            color: #30D158;
            transform: scale(1.1);
          }

          .ios-tab-glow {
            position: absolute;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: rgba(48, 209, 88, 0.35);
            filter: blur(8px);
            z-index: -1;
          }

          .ios-tab-label {
            font-size: 0.68rem;
            font-weight: 600;
            letter-spacing: -0.01em;
            transition: color 0.2s ease;
          }

          .ios-tab-btn.active .ios-tab-label {
            color: #ffffff;
            font-weight: 700;
          }
        }
      `}</style>
    </nav>
  );
};
