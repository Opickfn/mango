<?php

namespace App\Services\Umkm\Strategy;

use App\Models\Umkm\MachineManual;
use App\Models\Umkm\ProductionCapacity;
use App\Models\Umkm\Umkm;
use Illuminate\Database\Eloquent\Collection;

class TechnicalProfileService
{
    public function getProductionCapacities(
        Umkm $umkm
    ): Collection {
        return $umkm->productionCapacities;
    }

    public function storeProductionCapacity(
        Umkm $umkm,
        array $data
    ): ProductionCapacity {
        return $umkm
            ->productionCapacities()
            ->create($data);
    }

    public function updateProductionCapacity(
        ProductionCapacity $capacity,
        array $data
    ): ProductionCapacity {
        $capacity->update($data);

        return $capacity->fresh();
    }

    public function deleteProductionCapacity(
        ProductionCapacity $capacity
    ): bool {
        return $capacity->delete();
    }

    public function getMachineManuals(
        Umkm $umkm
    ): Collection {
        return $umkm->machineManuals;
    }

    public function storeMachineManual(
        Umkm $umkm,
        array $data
    ): MachineManual {
        return $umkm
            ->machineManuals()
            ->create($data);
    }

    public function updateMachineManual(
        MachineManual $machine,
        array $data
    ): MachineManual {
        $machine->update($data);

        return $machine->fresh();
    }

    public function deleteMachineManual(
        MachineManual $machine
    ): bool {
        return $machine->delete();
    }
}
