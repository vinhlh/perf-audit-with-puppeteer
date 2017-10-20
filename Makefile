KMS_KEY_ID=alias/oms/ecs
APP_NAME=perf-audit
DOCKER_REPO=589072213673.dkr.ecr.ap-southeast-1.amazonaws.com/perf-audit

OK_COLOR=\033[32;01m
NO_COLOR=\033[0m

build:
	@echo "$(OK_COLOR)==>$(NO_COLOR) Building $(DOCKER_REPO)"
	@docker build -t $(DOCKER_REPO) .

push:
	@echo "$(OK_COLOR)==>$(NO_COLOR) Pushing $(DOCKER_REPO)"
	# @aws ecr get-login | bash
	@docker push $(DOCKER_REPO)

run:
	@echo "$(OK_COLOR)==>$(NO_COLOR) Running $(DOCKER_REPO)"
	@docker rm -f $(APP_NAME) || true
	docker run --name $(APP_NAME) $(DOCKER_REPO)

deploy:
	cd infras && terraform apply && cd ..

deploy-new-version:
	cd infras && terraform taint aws_ecs_task_definition.perf_audit && terraform apply && cd ..
