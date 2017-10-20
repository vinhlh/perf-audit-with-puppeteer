provider "aws" {
  region = "ap-southeast-1"
}

variable "ecs_cluster" {
  type    = "string"
  default = "arn:aws:ecs:ap-southeast-1:589072213673:cluster/oms-services-ECSCluster-1OC1V236PW8KI"
}

variable "iam_role" {
  type    = "string"
  default = "arn:aws:iam::589072213673:role/ecsServiceRole"
}

resource "aws_ecr_repository" "perf_audit" {
  name = "perf-audit"
}

resource "aws_cloudwatch_event_rule" "perf_audit" {
  name                = "perf-audit"
  schedule_expression = "rate(5 minutes)"
}

resource "aws_cloudwatch_event_target" "perf_audit" {
  arn      = "${var.ecs_cluster}"
  rule     = "${aws_cloudwatch_event_rule.perf_audit.name}"
  role_arn = "${var.iam_role}"
  ecs_target {
    task_count = 1
    task_definition_arn = "${aws_ecs_task_definition.perf_audit.arn}"
  }
}

resource "aws_ecs_task_definition" "perf_audit" {
  family = "perf-audit"

  container_definitions = <<DEFINITION
[
  {
    "name": "perf-audit",
    "image": "589072213673.dkr.ecr.ap-southeast-1.amazonaws.com/perf-audit:latest",
    "environment": [{
      "name": "version",
      "value": "1"
    }],
    "cpu": 512,
    "memoryReservation": 494,
    "portMappings": []
  }
]
DEFINITION
}
