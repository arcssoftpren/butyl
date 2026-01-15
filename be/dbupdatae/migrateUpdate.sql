USE `butyl`;

ALTER TABLE `t_role`
ADD COLUMN IF NOT EXISTS `can_delete_inspection` TINYINT(1) NOT NULL DEFAULT '0';