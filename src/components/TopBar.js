import React from 'react';
import { Icon } from '@material-ui/core';
import styled from 'styled-components';

// 定义主题色和派生色
export const THEME = {
  primary: 'rgb(192,168,1)',        // 主题色
  inversePrimary: 'rgb(72,64,0)',   // 派生色，用于选中标签文字
  textOnPrimary: '#ffffff',         // 主题色上的文字颜色
  primaryLight: 'rgb(219,200,77)',  // 主题色亮色变体，用于Logo等
  secondaryContainer: 'rgb(246, 239, 186)', // 浅黄色，主题色的淡化版本
};

// 基础容器
const TopBarContainer = styled.div`
  display: flex;
  width: 100%;
`;

const TopBarContent = styled.div`
  background: ${THEME.primary};
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
  width: 50px;
  height: 50px;
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
  background: ${props => props.selected ? THEME.primaryLight : 'transparent'};
`;

const TabLabel = styled.div`
  color: ${props => props.selected ? THEME.inversePrimary : THEME.textOnPrimary};
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
  background: ${THEME.primaryLight};
  border-radius: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  position: relative;
`;

const AvatarText = styled.div`
  color: ${THEME.inversePrimary};
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
    color: ${THEME.primaryLight};
  }
  
  .icon-onprimary {
    color: ${THEME.textOnPrimary};
  }
  
  .icon-selected {
    color: ${THEME.inversePrimary};
  }
`;

const TopBar = () => {
  return (
    <StyledIconWrapper>
      <TopBarContainer>
        <TopBarContent>
          <LogoContainer>
            <TopBarLogo>
              <IconContainer className="icon">
                <Icon className="icon-primary icon-medium">water_drop</Icon>
              </IconContainer>
            </TopBarLogo>
            <AppName>SIMALFA</AppName>
          </LogoContainer>

          <Tabs>
            <Tab selected>
              <IconContainer className="icon">
                <Icon className="icon-selected icon-medium">receipt_long</Icon>
              </IconContainer>
              <TabLabel selected>E-Invoice (China)</TabLabel>
            </Tab>

            <Tab>
              <IconContainer className="icon">
                <Icon className="icon-onprimary icon-medium icon-light">box</Icon>
              </IconContainer>
              <TabLabel>Lot Management</TabLabel>
            </Tab>

            <VerticalDivider />

            <Tab>
              <IconContainer className="icon">
                <Icon className="icon-onprimary icon-medium icon-light">family_history</Icon>
              </IconContainer>
              <TabLabel>Cross Entity Orders</TabLabel>
            </Tab>

            <VerticalDivider />

            <Tab>
              <IconContainer className="icon">
                <Icon className="icon-onprimary icon-medium icon-light">psychiatry</Icon>
              </IconContainer>
              <TabLabel>OMS</TabLabel>
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

            <UserAvatar>
              <AvatarText>AB</AvatarText>
            </UserAvatar>
          </ActionsContainer>
        </TopBarContent>
      </TopBarContainer>
    </StyledIconWrapper>
  );
};

export default TopBar; 