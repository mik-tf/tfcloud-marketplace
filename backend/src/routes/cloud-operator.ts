import express from 'express';
import { CloudOperatorController } from '../controllers/cloudOperatorController';
import { checkRole, ROLES } from '../middleware/auth';

const router = express.Router();
const cloudOperatorController = new CloudOperatorController();

/**
 * @route   GET /api/cloud-operator/settings
 * @desc    Get dashboard settings
 * @access  Private (cloud-operator)
 */
router.get(
  '/settings',
  checkRole(ROLES.CLOUD_OPERATOR),
  cloudOperatorController.getSettings
);

/**
 * @route   PUT /api/cloud-operator/settings
 * @desc    Update dashboard settings
 * @access  Private (cloud-operator)
 */
router.put(
  '/settings',
  checkRole(ROLES.CLOUD_OPERATOR),
  cloudOperatorController.updateSettings
);

/**
 * @route   GET /api/cloud-operator/pricing
 * @desc    Get pricing configuration
 * @access  Private (cloud-operator)
 */
router.get(
  '/pricing',
  checkRole(ROLES.CLOUD_OPERATOR),
  cloudOperatorController.getPricing
);

/**
 * @route   PUT /api/cloud-operator/pricing
 * @desc    Update pricing configuration
 * @access  Private (cloud-operator)
 */
router.put(
  '/pricing',
  checkRole(ROLES.CLOUD_OPERATOR),
  cloudOperatorController.updatePricing
);

/**
 * @route   GET /api/cloud-operator/provider-requests
 * @desc    Get all provider requests
 * @access  Private (cloud-operator)
 */
router.get(
  '/provider-requests',
  checkRole(ROLES.CLOUD_OPERATOR),
  cloudOperatorController.getProviderRequests
);

/**
 * @route   PUT /api/cloud-operator/provider-requests/:id
 * @desc    Update provider request status
 * @access  Private (cloud-operator)
 */
router.put(
  '/provider-requests/:id',
  checkRole(ROLES.CLOUD_OPERATOR),
  cloudOperatorController.updateProviderRequestStatus
);

/**
 * @route   GET /api/cloud-operator/users
 * @desc    Get all users
 * @access  Private (cloud-operator)
 */
router.get(
  '/users',
  checkRole(ROLES.CLOUD_OPERATOR),
  cloudOperatorController.getUsers
);

/**
 * @route   GET /api/cloud-operator/deployments
 * @desc    Get all deployments
 * @access  Private (cloud-operator)
 */
router.get(
  '/deployments',
  checkRole(ROLES.CLOUD_OPERATOR),
  cloudOperatorController.getAllDeployments
);

export default router;