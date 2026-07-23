'use server';

import { SettingsService } from '@/lib/services/settings.service';
import { revalidatePath } from 'next/cache';

export async function updateCMSHeroAction(heroData: any) {
  try {
    const currentCMS = await SettingsService.getSetting('cms');
    const newCMS = {
      ...currentCMS,
      hero: {
        ...currentCMS.hero,
        ...heroData,
      },
    };
    
    await SettingsService.updateSetting('cms', newCMS, 'Updated via Admin CMS Panel');
    revalidatePath('/'); // Revalidate the home page
    revalidatePath('/admin/cms');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to update CMS Hero:', error);
    return { error: error.message };
  }
}

export async function updateCMSMetricsAction(metricsData: any[]) {
  try {
    const currentCMS = await SettingsService.getSetting('cms');
    const newCMS = { ...currentCMS, metrics: metricsData };
    await SettingsService.updateSetting('cms', newCMS, 'Updated Metrics via Admin CMS Panel');
    revalidatePath('/');
    revalidatePath('/admin/cms');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to update CMS Metrics:', error);
    return { error: error.message };
  }
}

export async function updateCMSTestimonialsAction(testimonialsData: any[]) {
  try {
    const currentCMS = await SettingsService.getSetting('cms');
    const newCMS = { ...currentCMS, testimonials: testimonialsData };
    await SettingsService.updateSetting('cms', newCMS, 'Updated Testimonials via Admin CMS Panel');
    revalidatePath('/');
    revalidatePath('/admin/cms');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to update CMS Testimonials:', error);
    return { error: error.message };
  }
}

export async function updateCMSPartnersAction(partnersData: any[]) {
  try {
    const currentCMS = await SettingsService.getSetting('cms');
    const newCMS = { ...currentCMS, partners: partnersData };
    await SettingsService.updateSetting('cms', newCMS, 'Updated Partners via Admin CMS Panel');
    revalidatePath('/');
    revalidatePath('/admin/cms');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to update CMS Partners:', error);
    return { error: error.message };
  }
}
