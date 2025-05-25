<?php

namespace App\Services;

use App\Repositories\StatsRepository;

class StatsService
{
    protected StatsRepository $statsRepository;

    public function __construct(StatsRepository $statsRepository)
    {
        $this->statsRepository = $statsRepository;
    }

    public function getTodosStatsByStatus(): array
    {
        return $this->statsRepository->getTodosCountByStatus();
    }

    public function getTodosStatsByPriority(): array
    {
        return $this->statsRepository->getTodosCountByPriority();
    }
}
