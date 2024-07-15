const Layout = () => import("@/layout/index.vue");

export default {
  path: "/business-master-data/index",
  name: "business_master_data",
  component: Layout,
  meta: {
    title: "业务主数据",
    rank: 0,
    showLink: false
  },
  children: [
    {
      path: "/public-setting/public-basic-data/country",
      name: "country",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/base/area/countryList/index.vue"
        ),
      meta: {
        title: "国家管理",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/public-setting/public-basic-data/administrative-division",
      name: "administrative_division",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/base/area/divisionList/index.vue"
        ),
      meta: {
        title: "行政区划",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/public-setting/public-basic-data/local-code-maintain",
      name: "local_code_maintain",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/base/area/divisionCodeList/index.vue"
        ),
      meta: {
        title: "地区简码维护",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/public-setting/public-basic-data/currency-list",
      name: "currency_list",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/base/finance/currencyList/index.vue"
        ),
      meta: {
        title: "币别列表",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/public-setting/public-basic-data/exchange-rate-list",
      name: "exchange_rate_list",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/base/finance/exchangeRateList/index.vue"
        ),
      meta: {
        title: "汇率列表",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/public-setting/public-basic-data/exchange-rate-conversion",
      name: "exchange_rate_conversion",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/base/finance/exchangeRateConversionList/index.vue"
        ),
      meta: {
        title: "外币转化",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/public-setting/public-basic-data/tax-types-list",
      name: "tax_types_list",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/base/finance/taxTypesList/index.vue"
        ),
      meta: {
        title: "税种列表",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/public-setting/public-basic-data/tax-system-list",
      name: "tax_system_list",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/base/finance/taxSystemList/index.vue"
        ),
      meta: {
        title: "税收制度",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/public-setting/public-basic-data/tax-rate-list",
      name: "tax_rate_list",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/base/finance/taxRateList/index.vue"
        ),
      meta: {
        title: "税率列表",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/public-setting/public-basic-data/bank-name-and-code",
      name: "bank_name_and_code",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/base/finance/bankList/index.vue"
        ),
      meta: {
        title: "行名行号",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/public-setting/public-basic-data/bank-interest-rate",
      name: "bank_interest_rate",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/base/finance/bankRateList/index.vue"
        ),
      meta: {
        title: "银行利率",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/public-setting/public-basic-data/national-working-hours",
      name: "national_working_hours",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/base/area/countryWorkTimeList/index.vue"
        ),
      meta: {
        title: "国家工作时间",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/public-setting/public-basic-data/work-calendar",
      name: "work_calendar",
      component: () =>
        import("@/geto-components/GetoMspPage/views/error/building.vue"),
      meta: {
        title: "工作日历",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/public-setting/public-basic-data/measuring-unit",
      name: "measuring_unit",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/base/common/measureUnitList/index.vue"
        ),
      meta: {
        title: "计量单位",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/public-setting/public-basic-data/period-manage",
      name: "period_manage",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/base/finance/periodList/index.vue"
        ),
      meta: {
        title: "期间管理",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/public-setting/public-basic-data/group-type-manage",
      name: "group_type_manage",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/base/common/groupTypeList/index.vue"
        ),
      meta: {
        title: "组别类型管理",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/public-setting/public-basic-data/group-manage",
      name: "group_manage",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/base/common/groupList/index.vue"
        ),
      meta: {
        title: "组别管理",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/public-setting/public-basic-data/triangle-manage",
      name: "triangle-manage",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/base/common/triangleList/index.vue"
        ),
      meta: {
        title: "铁三角关系管理",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/public-setting/public-basic-data/assist-material-category",
      name: "assist_material_category",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/base/common/assistedMaterialCategoryList/index.vue"
        ),
      meta: {
        title: "辅助资料类别",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/public-setting/public-basic-data/assist-material",
      name: "assist_material",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/base/common/assistedMaterialList/index.vue"
        ),
      meta: {
        title: "辅助资料",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/public-setting/public-basic-data/sensitive-thesaurus",
      name: "sensitive_thesaurus",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/base/common/sensitiveThesaurusList/index.vue"
        ),
      meta: {
        title: "敏感词库",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/public-setting/public-basic-data/ship-harbor",
      name: "ship_harbor",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/base/common/shipHarbor/index.vue"
        ),
      meta: {
        title: "港口信息",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/public-setting/public-basic-data/product-type",
      name: "common_product_type",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/base/common/productTypeList/index.vue"
        ),
      meta: {
        title: "产品类型维护",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/public-setting/public-basic-data/company-manage",
      name: "company_manage_mh",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/base/common/companyManage/index.vue"
        ),
      meta: {
        title: "公司管理",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/public-setting/public-basic-data/distance-maintain",
      name: "md_distance",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/base/common/distanceMaintain/index.vue"
        ),
      meta: {
        title: "物流运输距离",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/sync/strategy",
      name: "sync_strategy",
      component: () =>
        import("@/geto-components/GetoMspPage/views/sync/strategy/index.vue"),
      meta: {
        title: "策略任务",
        module: "sync_strategy",
        roles: ["sync_strategy"]
      }
    },
    {
      path: "/sync/log",
      name: "sync_log",
      component: () =>
        import("@/geto-components/GetoMspPage/views/sync/log/index.vue"),
      meta: {
        title: "任务日志",
        module: "sync_log",
        roles: ["sync_log"]
      }
    }
  ]
} as RouteConfigsTable;
