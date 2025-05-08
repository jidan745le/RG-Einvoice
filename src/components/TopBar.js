import { Icon } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useAppConfig } from './AppConfigProvider';

// Theme will be dynamically generated based on config
const TopBarContainer = styled.div`
  display: flex;
  width: 100%;
`;

const TopBarContent = styled.div`
  background: ${props => props.theme.primary};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
`;

// Logo 和品牌部分
const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: 260px;
`;

const TopBarLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
`;

const AppName = styled.div`
  color: #fdf8ff;
  text-align: left;
  font-size: 18px;
  line-height: 14px;
  letter-spacing: 0.1px;
  font-weight: 700;
  font-style: italic;
`;

// 标签页部分
const Tabs = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
`;

const Tab = styled.div`
  padding: 8px 12px;
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  background: ${props => props.selected ? props.theme.inversePrimary : 'transparent'};
`;

const TabLabel = styled.div`
  color: ${props => props.selected ? props.theme.inverseSurface : props.theme.textOnPrimary};
  text-align: left;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.1px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const VerticalDivider = styled.div`
  width: 1px;
  height: 32px;
  background-color: rgba(255, 255, 255, 0.3);
`;

// 动作区域
const ActionsContainer = styled.div`
  padding: 0 16px;
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: center;
  justify-content: flex-end;
`;

const LanguageSelector = styled.div`
  background: #ffffff;
  border-radius: 4px;
  padding: 8px 8px 8px 12px;
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
  justify-content: flex-start;
  height: 40px;
`;

const LanguageText = styled.div`
  color: #484459;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.5px;
  font-weight: 400;
`;

const UserAvatar = styled.div`
  background: ${props => props.theme.inversePrimary};
  border-radius: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  position: relative;
  cursor: pointer;
`;

const AvatarText = styled.div`
  color: ${props => props.theme.inverseSurface};
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.5px;
  font-weight: 400;
`;

// User dropdown menu
const UserDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 300px;
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  z-index: 1000;
  display: none;
  margin-top: 4px;
`;

const UserMenuContainer = styled.div`
  position: relative;
  
  &:hover ${UserDropdown} {
    display: block;
  }
`;

const UserInfoSection = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
`;

const UserName = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const UserEmail = styled.div`
  font-size: 14px;
  color: #666;
`;

const UserAccountInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
`;

const AccountAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AccountAvatarText = styled.div`
  color: white;
  font-size: 20px;
  font-weight: 500;
`;

const AccountDetails = styled.div`
  flex: 1;
`;

const LogoutButton = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 8px 16px;
  border-top: 1px solid #f0f0f0;
`;

const LogoutButtonText = styled.div`
  color: ${props => props.theme.primary};
  font-size: 14px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  
  &:hover {
    background: ${props => props.theme.primary}10;
  }
`;

const MenuSection = styled.div`
  padding: 8px 0;
`;

const MenuItem = styled.div`
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  
  &:hover {
    background: #f5f5f5;
  }
`;

const MenuItemLabel = styled.div`
  font-size: 14px;
  color: #333;
`;

const AccountId = styled.div`
  font-size: 12px;
  color: #888;
`;

const TenantInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 4px;
`;

const TenantName = styled.div`
  font-size: 13px;
  color: #666;
  font-weight: 500;
`;

const VerificationTag = styled.div`
  font-size: 12px;
  color: ${props => props.theme.primary};
  background: ${props => props.theme.primary}10;
  padding: 6px 0px;
  border-radius: 4px;
`;

// 图标容器 - 保持原有的类名以避免影响其他组件
const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 新增图标样式
const StyledIconWrapper = styled.div`
  .icon-primary {
    color: ${props => props.theme.inverseSurface};
  }
  
  .icon-onprimary {
    color: ${props => props.theme.textOnPrimary};
  }
  
  .icon-selected {
    color: ${props => props.theme.inverseSurface};
  }
`;

const TopBar = () => {
  const { config, loading, theme } = useAppConfig();
  const [userInfo, setUserInfo] = useState(null);
  const dropdownRef = useRef(null);

  // 获取应用程序和租户信息
  const themeSettings = config?.settings?.themeSetting;
  const logoUrl = themeSettings?.logoUrl || "";
  const appName = config?.application?.name || "Electronic Invoice System";
  const tenantName = config?.tenant?.name || "SIMALFA";

  useEffect(() => {
    // Get user info from localStorage
    try {
      const storedUserInfo = localStorage.getItem('userInfo');
      if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      }
    } catch (error) {
      console.error('Error parsing userInfo from localStorage:', error);
    }
  }, []);

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out...');
    // Clear localStorage, redirect to login, etc.
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userInfo || !userInfo.name) return 'U';
    return userInfo.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <StyledIconWrapper theme={theme}>
      <TopBarContainer>
        <TopBarContent theme={theme}>
          <LogoContainer>
            <TopBarLogo>
              <img height={40} src={`/api/${logoUrl}`} alt="logo" />
            </TopBarLogo>
            {/* <AppName>{tenantName}</AppName> */}
          </LogoContainer>

          <Tabs>
            <Tab selected theme={theme}>
              <IconContainer className="icon">
                <Icon className="icon-selected icon-medium">receipt_long</Icon>
              </IconContainer>
              <TabLabel selected theme={theme}>E-Invoice (China)</TabLabel>
            </Tab>

            <Tab theme={theme}>
              <IconContainer className="icon">
                <Icon className="icon-onprimary icon-medium icon-light">box</Icon>
              </IconContainer>
              <TabLabel theme={theme}>Lot Management</TabLabel>
            </Tab>

            <VerticalDivider />

            <Tab theme={theme}>
              <IconContainer className="icon">
                <Icon className="icon-onprimary icon-medium icon-light">family_history</Icon>
              </IconContainer>
              <TabLabel theme={theme}>Cross Entity Orders</TabLabel>
            </Tab>

            <VerticalDivider />

            <Tab theme={theme}>
              <IconContainer className="icon">
                <Icon className="icon-onprimary icon-medium icon-light">psychiatry</Icon>
              </IconContainer>
              <TabLabel theme={theme}>OMS</TabLabel>
            </Tab>
          </Tabs>

          <ActionsContainer>
            <LanguageSelector>
              <IconContainer className="icon">
                <Icon className="icon-secondary icon-medium icon-light">language</Icon>
              </IconContainer>
              <LanguageText>English</LanguageText>
              <IconContainer className="icon">
                <Icon className="icon-secondary icon-medium icon-light">arrow_drop_down</Icon>
              </IconContainer>
            </LanguageSelector>

            <UserMenuContainer ref={dropdownRef}>
              <UserAvatar theme={theme}>
                <AvatarText theme={theme}>{getUserInitials()}</AvatarText>
              </UserAvatar>

              <UserDropdown>
                <UserAccountInfo>
                  <AccountAvatar theme={theme}>
                    <AccountAvatarText>{getUserInitials()}</AccountAvatarText>
                  </AccountAvatar>
                  <AccountDetails>
                    <UserName>{userInfo?.name || 'User'}</UserName>
                    <AccountId>Account ID: {userInfo?.id?.substring(0, 16) || '-'}</AccountId>
                    <TenantInfo>
                      <TenantName>{userInfo?.tenant?.name || '-'}</TenantName>
                      <VerificationTag theme={theme}>Enterprise Verification</VerificationTag>
                    </TenantInfo>
                  </AccountDetails>
                </UserAccountInfo>
              </UserDropdown>
            </UserMenuContainer>
          </ActionsContainer>
        </TopBarContent>
      </TopBarContainer>
    </StyledIconWrapper>
  );
};

export default TopBar; 