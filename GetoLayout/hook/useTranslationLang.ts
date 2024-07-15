/*
 * @Author: 高文进 gwj@geto.com.cn
 * @Date: 2023-11-13 10:35:33
 * @LastEditors: 高文进 gwj@geto.com.cn
 * @LastEditTime: 2023-11-14 14:13:52
 * @FilePath: \sys-web\src\geto-components\GetoLayout\hook\useTranslationLang.ts
 * @Description:
 *
 * Copyright (c) gwj, All Rights Reserved.
 */
import { useNav } from "@/layout/hooks/useNav";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { watch, onBeforeMount, computed, type Ref } from "vue";
import { useEpThemeStoreHook } from "@/store/modules/epTheme";
import { storageSession } from "@pureadmin/utils";

interface localeSession {
  locale: string;
}

export function useTranslationLang(ref?: Ref) {
  const { $storage, changeTitle, handleResize } = useNav();
  const { locale, t } = useI18n();
  const localeLang = storageSession().getItem<localeSession>("locale");
  const route = useRoute();

  function translationCh() {
    $storage.locale = { locale: "zh" };
    locale.value = "zh";
    ref && handleResize(ref.value);
    storageSession().setItem("locale", {
      locale: locale.value
    });
  }

  function translationEn() {
    $storage.locale = { locale: "en" };
    locale.value = "en";
    ref && handleResize(ref.value);
    storageSession().setItem("locale", {
      locale: locale.value
    });
  }

  watch(
    () => locale.value,
    () => {
      changeTitle(route.meta);
    }
  );

  onBeforeMount(() => {
    locale.value = localeLang?.locale ?? "zh";
  });

  /** 设置国际化选中后的样式 */
  const getDropdownItemStyle = computed(() => {
    return (locale, t) => {
      return {
        background: locale === t ? useEpThemeStoreHook().epThemeColor : "",
        color: locale === t ? "#f4f4f5" : "#000"
      };
    };
  });

  const getDropdownItemClass = computed(() => {
    return (locale, t) => {
      return locale === t ? "" : "dark:hover:!text-primary";
    };
  });

  return {
    t,
    route,
    locale,
    translationCh,
    translationEn,
    getDropdownItemStyle,
    getDropdownItemClass
  };
}
