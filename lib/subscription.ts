// Utility functions for subscription management

export interface Subscription {
  plan: '1month' | '1year' | '3months';
  startDate: string;
  status: 'active' | 'expired' | 'cancelled';
  expiryDate?: string;
}

/**
 * Check if user has an active subscription
 */
export const hasActiveSubscription = (): boolean => {
  try {
    const subscription = localStorage.getItem('userSubscription');
    if (!subscription) return false;
    
    const subData: Subscription = JSON.parse(subscription);
    
    // Check status
    if (subData.status !== 'active') return false;
    
    // Check expiry date if exists
    if (subData.expiryDate) {
      const expiryDate = new Date(subData.expiryDate);
      const now = new Date();
      if (now > expiryDate) {
        // Update status to expired
        updateSubscriptionStatus('expired');
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error checking subscription:', error);
    return false;
  }
};

/**
 * Get current subscription details
 */
export const getSubscription = (): Subscription | null => {
  try {
    const subscription = localStorage.getItem('userSubscription');
    if (!subscription) return null;
    
    return JSON.parse(subscription);
  } catch (error) {
    console.error('Error getting subscription:', error);
    return null;
  }
};

/**
 * Save subscription data
 */
export const saveSubscription = (planId: string): void => {
  const now = new Date();
  let expiryDate: Date;
  
  // Calculate expiry date based on plan
  switch (planId) {
    case '1month':
      expiryDate = new Date(now.setMonth(now.getMonth() + 1));
      break;
    case '3months':
      expiryDate = new Date(now.setMonth(now.getMonth() + 3));
      break;
    case '1year':
      expiryDate = new Date(now.setFullYear(now.getFullYear() + 1));
      break;
    default:
      expiryDate = new Date(now.setMonth(now.getMonth() + 1));
  }
  
  const subscription: Subscription = {
    plan: planId as '1month' | '1year' | '3months',
    startDate: new Date().toISOString(),
    status: 'active',
    expiryDate: expiryDate.toISOString(),
  };
  
  localStorage.setItem('userSubscription', JSON.stringify(subscription));
};

/**
 * Update subscription status
 */
export const updateSubscriptionStatus = (status: 'active' | 'expired' | 'cancelled'): void => {
  try {
    const subscription = localStorage.getItem('userSubscription');
    if (!subscription) return;
    
    const subData: Subscription = JSON.parse(subscription);
    subData.status = status;
    
    localStorage.setItem('userSubscription', JSON.stringify(subData));
  } catch (error) {
    console.error('Error updating subscription status:', error);
  }
};

/**
 * Cancel subscription
 */
export const cancelSubscription = (): void => {
  updateSubscriptionStatus('cancelled');
};

/**
 * Clear subscription data
 */
export const clearSubscription = (): void => {
  localStorage.removeItem('userSubscription');
};

/**
 * Get days remaining in subscription
 */
export const getDaysRemaining = (): number | null => {
  try {
    const subscription = getSubscription();
    if (!subscription || !subscription.expiryDate) return null;
    
    const expiryDate = new Date(subscription.expiryDate);
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  } catch (error) {
    console.error('Error calculating days remaining:', error);
    return null;
  }
};

/**
 * Get plan details
 */
export const getPlanDetails = (planId: string) => {
  const plans = {
    '1month': {
      name: '1 Bulan',
      price: 'Rp25.000',
      duration: '1 bulan',
    },
    '3months': {
      name: '3 Bulan',
      price: 'Rp70.000',
      duration: '3 bulan',
    },
    '1year': {
      name: '1 Tahun',
      price: 'Rp240.000',
      duration: '1 tahun',
    },
  };
  
  return plans[planId as keyof typeof plans] || null;
};

/**
 * Check if user can access premium content
 */
export const canAccessPremium = (): boolean => {
  return hasActiveSubscription();
};
