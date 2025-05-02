import express from 'express';
import { CloudUserController } from '../controllers/cloudUserController';
import { checkRole, ROLES } from '../middleware/auth';

const router = express.Router();
const cloudUserController = new CloudUserController();

/**
 * @route   GET /api/cloud-user/deployments
 * @desc    Get all deployments for the authenticated user
 * @access  Private (cloud-user)
 */
router.get(
  '/deployments',
  checkRole(ROLES.CLOUD_USER),
  cloudUserController.getDeployments
);

/**
 * @route   POST /api/cloud-user/deployments
 * @desc    Create a new deployment
 * @access  Private (cloud-user)
 */
router.post(
  '/deployments',
  checkRole(ROLES.CLOUD_USER),
  cloudUserController.createDeployment
);

/**
 * @route   GET /api/cloud-user/deployments/:id
 * @desc    Get details of a specific deployment
 * @access  Private (cloud-user)
 */
router.get(
  '/deployments/:id',
  checkRole(ROLES.CLOUD_USER),
  cloudUserController.getDeploymentDetails
);

/**
 * @route   PUT /api/cloud-user/deployments/:id
 * @desc    Update a deployment
 * @access  Private (cloud-user)
 */
router.put(
  '/deployments/:id',
  checkRole(ROLES.CLOUD_USER),
  cloudUserController.updateDeployment
);

/**
 * @route   DELETE /api/cloud-user/deployments/:id
 * @desc    Delete a deployment
 * @access  Private (cloud-user)
 */
router.delete(
  '/deployments/:id',
  checkRole(ROLES.CLOUD_USER),
  cloudUserController.deleteDeployment
);

/**
 * @route   GET /api/cloud-user/profile
 * @desc    Get user profile
 * @access  Private (cloud-user)
 */
router.get(
  '/profile',
  checkRole(ROLES.CLOUD_USER),
  cloudUserController.getUserProfile
);

/**
 * @route   PUT /api/cloud-user/profile
 * @desc    Update user profile
 * @access  Private (cloud-user)
 */
router.put(
  '/profile',
  checkRole(ROLES.CLOUD_USER),
  cloudUserController.updateUserProfile
);

export default router;