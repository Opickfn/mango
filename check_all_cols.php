<?php
require 'backend/vendor/autoload.php';
$app = require_once 'backend/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
use Illuminate\Support\Facades\Schema;

echo "Assessment Results Columns:\n";
print_r(Schema::getColumnListing('assessment_results'));

echo "\nAnswers Columns:\n";
print_r(Schema::getColumnListing('answers'));
