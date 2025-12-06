'use client';

import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageSwitcher from '../LanguageSwitcher';
import UpdateChecker from '../UpdateChecker';
import TaskIcon from '../TaskIcon';
import ModelSelect from '../ModelSelect';
import * as styles from './styles';

/**
 * ActionButtons 组件
 * 右侧操作区按钮：语言切换、主题切换、文档、GitHub、更新检查
 */
export default function ActionButtons({ theme, resolvedTheme, toggleTheme, isProjectDetail, currentProject }) {
  const { t, i18n } = useTranslation();

  return (
    <Box sx={styles.actionAreaStyles}>
      {isProjectDetail && <ModelSelect projectId={currentProject} />}
      {isProjectDetail && <TaskIcon theme={theme} projectId={currentProject} />}

      {/* Language Switcher - Always visible */}
      <LanguageSwitcher />

      {/* Theme Toggle - Always visible */}
      <Tooltip
        title={
          resolvedTheme === 'dark'
            ? t('theme.switchToLight', 'Switch to light mode')
            : t('theme.switchToDark', 'Switch to dark mode')
        }
      >
        <IconButton
          onClick={toggleTheme}
          size="medium"
          aria-label={
            resolvedTheme === 'dark'
              ? t('theme.switchToLight', 'Switch to light mode')
              : t('theme.switchToDark', 'Switch to dark mode')
          }
          sx={styles.getIconButtonStyles(theme)}
        >
          {resolvedTheme === 'dark' ? (
            <LightModeOutlinedIcon fontSize="small" />
          ) : (
            <DarkModeOutlinedIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
}
