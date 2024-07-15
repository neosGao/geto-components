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
      path: "/business-master-data/crm/client",
      name: "md_client",
      component: () =>
        import("@/geto-components/GetoMspPage/views/business-master-data/crm/client.vue"),
      meta: {
        title: "客户",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/crm/client-category",
      name: "md_client_category",
      component: () =>
        import("@/geto-components/GetoMspPage/views/business-master-data/crm/client-category.vue"),
      meta: {
        title: "客户性质",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/crm/contact",
      name: "md_contact",
      component: () =>
        import("@/geto-components/GetoMspPage/views/business-master-data/crm/contact.vue"),
      meta: {
        title: "联系人",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/crm/project",
      name: "md_project",
      component: () =>
        import("@/geto-components/GetoMspPage/views/business-master-data/crm/project.vue"),
      meta: {
        title: "项目",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/crm/project-supplement-info",
      name: "md_project_supplement_info",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/business-master-data/crm/project-supplement-info.vue"
        ),
      meta: {
        title: "项目补充信息",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/crm/aluminum-price",
      name: "md_aluminum-price",
      component: () =>
        import("@/geto-components/GetoMspPage/views/business-master-data/crm/aluminum-price.vue"),
      meta: {
        title: "铝单价列表",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/crm/building-unit-split",
      name: "md_building_unit_split",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/business-master-data/crm/building-unit-split.vue"
        ),
      meta: {
        title: "楼栋单元拆分",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/crm/contract",
      name: "md_contract",
      component: () =>
        import("@/geto-components/GetoMspPage/views/business-master-data/crm/contract.vue"),
      meta: {
        title: "合同（含补充协议）",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/crm/contract-engineering",
      name: "md_contract_engineering",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/business-master-data/crm/contract-engineering.vue"
        ),
      meta: {
        title: "工程信息",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/crm/product-notice",
      name: "md_product_notice",
      component: () =>
        import("@/geto-components/GetoMspPage/views/business-master-data/crm/product-notice.vue"),
      meta: {
        title: "生产申请",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/crm/delivery-apply",
      name: "md_delivery_apply",
      component: () =>
        import("@/geto-components/GetoMspPage/views/business-master-data/crm/delivery-apply.vue"),
      meta: {
        title: "发货申请",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/plm/project-analysis",
      name: "md_project_analysis",
      component: () =>
        import("@/geto-components/GetoMspPage/views/business-master-data/plm/project-analysis.vue"),
      meta: {
        title: "项目分析方案",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/plm/mould-list",
      name: "md_mould_list",
      component: () =>
        import("@/geto-components/GetoMspPage/views/business-master-data/plm/mould-list.vue"),
      meta: {
        title: "配模清单",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/plm/spec-list",
      name: "md_spec_list",
      component: () =>
        import("@/geto-components/GetoMspPage/views/business-master-data/plm/spec-list.vue"),
      meta: {
        title: "变更清单",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/plm/qr-code-instruction-doc",
      name: "md_qr_code_instruction_doc",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/business-master-data/plm/qr-code-instruction-doc.vue"
        ),
      meta: {
        title: "二维码指示单",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/plm/material-category",
      name: "md_material_category",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/business-master-data/plm/material-category.vue"
        ),
      meta: {
        title: "物料分类",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/plm/warehouse-material",
      name: "md_warehouse_material",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/business-master-data/plm/warehouse-material.vue"
        ),
      meta: {
        title: "仓库物料",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/plm/design-material",
      name: "md_design_material",
      component: () =>
        import("@/geto-components/GetoMspPage/views/business-master-data/plm/design-material.vue"),
      meta: {
        title: "设计物料",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/plm/regular-material",
      name: "md_regular_material",
      component: () =>
        import("@/geto-components/GetoMspPage/views/business-master-data/plm/regular-material.vue"),
      meta: {
        title: "常规物料",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/plm/project-material",
      name: "md_project_material",
      component: () =>
        import("@/geto-components/GetoMspPage/views/business-master-data/plm/project-material.vue"),
      meta: {
        title: "项目物料",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/plm/area-volume-weight-rule",
      name: "md_area_volume_weight_rule",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/business-master-data/plm/area-volume-weight-rule.vue"
        ),
      meta: {
        title: "面积体积重量规则维护",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/plm/bom",
      name: "md_bom",
      component: () =>
        import("@/geto-components/GetoMspPage/views/business-master-data/plm/bom.vue"),
      meta: {
        title: "BOM维护",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/plm/construction-site-allocation-application",
      name: "md_construction_site_allocation_application",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/business-master-data/plm/construction-site-allocation-application.vue"
        ),
      meta: {
        title: "工地调拨申请",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/plm/site-feeding-order",
      name: "md_site_feeding_order",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/business-master-data/plm/site-feeding-order.vue"
        ),
      meta: {
        title: "工地补料申请",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/plm/area-confirm",
      name: "md_area_confirm",
      component: () =>
        import("@/geto-components/GetoMspPage/views/business-master-data/plm/area-confirm.vue"),
      meta: {
        title: "面积确认",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/scm/delivery-list",
      name: "md_delivery_list",
      component: () =>
        import("@/geto-components/GetoMspPage/views/business-master-data/scm/delivery-list.vue"),
      meta: {
        title: "采购清单",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/scm/purchase-list",
      name: "md_purchase_list",
      component: () =>
        import("@/geto-components/GetoMspPage/views/business-master-data/scm/purchase-list.vue"),
      meta: {
        title: "采购清单",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/scm/crawling-project-stock-up",
      name: "md_crawling_project_stock_up",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/business-master-data/scm/crawling-project-stock-up.vue"
        ),
      meta: {
        title: "爬架项目备货",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/scm/pack-list",
      name: "md_pack_list",
      component: () =>
        import("@/geto-components/GetoMspPage/views/business-master-data/scm/pack-list.vue"),
      meta: {
        title: "打包清单",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/scm/pmc-category",
      name: "md_pmc_category",
      component: () =>
        import("@/geto-components/GetoMspPage/views/business-master-data/scm/pmc-category.vue"),
      meta: {
        title: "PMC清单分类",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/scm/warehouse",
      name: "md_warehouse",
      component: () =>
        import("@/geto-components/GetoMspPage/views/business-master-data/scm/warehouse.vue"),
      meta: {
        title: "仓库",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/scm/ship-totals-order",
      name: "md_ship_totals_order",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/business-master-data/scm/ship-totals-order.vue"
        ),
      meta: {
        title: "发货汇总单",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/mes/production-scheduling",
      name: "md_production_scheduling",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/business-master-data/mes/production-scheduling.vue"
        ),
      meta: {
        title: "排产计划",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/mes/production-scheduling-detail",
      name: "md_production_scheduling_detail",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/business-master-data/mes/production-scheduling-detail.vue"
        ),
      meta: {
        title: "排产计划详情",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/mes/turn-factory-production-scheduling",
      name: "md_turn_factory_production_scheduling",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/business-master-data/mes/turn-factory-production-scheduling.vue"
        ),
      meta: {
        title: "转厂申请",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/mes/qr-code-instruction-doc-production",
      name: "md_qr_code_instruction_doc_production",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/business-master-data/mes/qr-code-instruction-doc-production.vue"
        ),
      meta: {
        title: "二维码指示单（生产）",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/mes/factory",
      name: "md_factory",
      component: () =>
        import("@/geto-components/GetoMspPage/views/business-master-data/mes/factory.vue"),
      meta: {
        title: "工厂列表",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/mes/project-production",
      name: "md_project_production",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/business-master-data/mes/project-production.vue"
        ),
      meta: {
        title: "项目生产单",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/mes/spare-parts-production",
      name: "md_spare_parts_production",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/business-master-data/mes/spare-parts-production.vue"
        ),
      meta: {
        title: "备库件生产单",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/esm/engineering-daily",
      name: "md_engineering_daily",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/business-master-data/esm/engineering-daily.vue"
        ),
      meta: {
        title: "铝模工程日报",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/esm/engineering-daily-pj",
      name: "md_engineering_daily_pj",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/business-master-data/esm/engineering-daily-pj.vue"
        ),
      meta: {
        title: "爬架工程日报",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/esm/progress-after-shipment",
      name: "md_progress_after_shipment",
      component: () =>
        import(
          "@/geto-components/GetoMspPage/views/business-master-data/esm/progress-after-shipment.vue"
        ),
      meta: {
        title: "发货后进度",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/esm/engineering-cert",
      name: "md_engineering_cert",
      component: () =>
        import("@/geto-components/GetoMspPage/views/business-master-data/esm/engineering-cert.vue"),
      meta: {
        title: "工程签证",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    },
    {
      path: "/business-master-data/esm/recycle-assign",
      name: "md_recycle_assign",
      component: () =>
        import("@/geto-components/GetoMspPage/views/business-master-data/esm/recycle-assign.vue"),
      meta: {
        title: "物资回收",
        keepAlive: true,
        activePath: "/business-master-data/index"
      }
    }
  ]
} as RouteConfigsTable;
