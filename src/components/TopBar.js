import { Icon } from '@material-ui/core';
import React from 'react';
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
`;

const AvatarText = styled.div`
  color: ${props => props.theme.inverseSurface};
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.5px;
  font-weight: 400;
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

  // 获取应用程序和租户信息
  const themeSettings = config?.settings?.themeSetting;
  const logoUrl = themeSettings?.logoUrl || "";
  const appName = config?.application?.name || "Electronic Invoice System";
  const tenantName = config?.tenant?.name || "SIMALFA";

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <StyledIconWrapper theme={theme}>
      <TopBarContainer>
        <TopBarContent theme={theme}>
          <LogoContainer>
            <TopBarLogo>
              <img src={`/api/${logoUrl}`} alt="logo" />
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

            <UserAvatar theme={theme}>
              <AvatarText theme={theme}>AB</AvatarText>
            </UserAvatar>
          </ActionsContainer>
        </TopBarContent>
      </TopBarContainer>
    </StyledIconWrapper>
  );
};

export default TopBar; 