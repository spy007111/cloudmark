"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useMessages, useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function Page() {
  const t = useTranslations("HomePage");
  const messages = useMessages();
  // @ts-expect-error
  const keys = Object.keys(messages.HomePage.features);
  
  // 动画变体
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container relative">
      {/* 装饰背景元素 */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-500/10 rounded-full blur-3xl transform -translate-y-12 translate-x-12" />
        <div className="absolute bottom-0 left-0 w-[50rem] h-[50rem] bg-purple-500/10 rounded-full blur-3xl transform translate-y-12 -translate-x-12" />
        <div className="absolute bottom-1/3 right-1/4 w-[30rem] h-[30rem] bg-indigo-500/5 rounded-full blur-3xl" />
      </div>
      
      {/* Hero 区域 */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center pt-16 lg:pt-24 pb-8 max-w-3xl mx-auto"
      >
        {/* Logo 和主标题 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative mb-3"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
            Cloudmark
          </h1>
          <div className="absolute -inset-1 bg-blue-500/20 rounded-full blur-xl -z-10" />
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6"
        >
          {t("title")}
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-xl text-muted-foreground mb-8 max-w-xl"
        >
          {t("description")}
        </motion.p>
        
        <div className="flex gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button asChild size="lg" className="rounded-full text-base px-8">
              <Link href="/doc" className="flex items-center gap-2">
                {t("quickstart")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button asChild size="lg" variant="outline" className="rounded-full text-base px-8">
              <Link href="/demo" className="flex items-center gap-2">
                Demo
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* 特性卡片 */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-12"
      >
        {keys.map((key, index) => (
          <motion.div
            key={key}
            variants={item}
            whileHover={{ 
              y: -5, 
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" 
            }}
            className="relative rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm p-6 transition-all"
          >
            <div className="absolute top-0 right-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-lg -z-10 transform -translate-y-1/4 translate-x-1/4" />
            <h3 className="font-semibold mb-3 text-xl">
              {t(`features.${key}.title`)}
            </h3>
            <p className="text-muted-foreground">
              {t(`features.${key}.desc`)}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
